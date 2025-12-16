"""
Core Models for the ERP system.
Base models used across all modules.
"""
from django.db import models
from django.conf import settings


class TimeStampedModel(models.Model):
    """Abstract base model with timestamp fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class Branch(TimeStampedModel):
    """Branch/Store locations."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    province = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    
    # Branch manager
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_branches'
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_main = models.BooleanField(default=False, help_text='Is this the main/head office?')
    
    # Operating hours
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    
    # Financial settings
    default_warehouse = models.ForeignKey(
        'Warehouse',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='default_for_branches'
    )
    
    class Meta:
        verbose_name = 'Branch'
        verbose_name_plural = 'Branches'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Department(TimeStampedModel):
    """Company departments."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Parent department (for hierarchy)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )
    
    # Department head
    head = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments'
    )
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Warehouse(TimeStampedModel):
    """Warehouse/Storage locations."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    address = models.TextField(blank=True)
    
    # Associated branch
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name='warehouses'
    )
    
    # Warehouse manager
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_warehouses'
    )
    
    # Type of warehouse
    WAREHOUSE_TYPES = [
        ('main', 'Main Warehouse'),
        ('retail', 'Retail Store'),
        ('transit', 'Transit Warehouse'),
        ('defective', 'Defective/Returns'),
        ('consignment', 'Consignment'),
    ]
    warehouse_type = models.CharField(max_length=20, choices=WAREHOUSE_TYPES, default='main')
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Warehouse'
        verbose_name_plural = 'Warehouses'
        ordering = ['branch', 'name']
    
    def __str__(self):
        return f"{self.code} - {self.name} ({self.branch.code})"


class Currency(TimeStampedModel):
    """Currency definitions for multi-currency support."""
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=5)
    exchange_rate = models.DecimalField(max_digits=15, decimal_places=6, default=1.000000)
    is_base = models.BooleanField(default=False, help_text='Is this the base currency?')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Currency'
        verbose_name_plural = 'Currencies'
        ordering = ['-is_base', 'code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class FiscalYear(TimeStampedModel):
    """Fiscal year definitions."""
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)
    is_current = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Fiscal Year'
        verbose_name_plural = 'Fiscal Years'
        ordering = ['-start_date']
    
    def __str__(self):
        return self.name


class FiscalPeriod(TimeStampedModel):
    """Fiscal periods within a fiscal year."""
    fiscal_year = models.ForeignKey(
        FiscalYear,
        on_delete=models.CASCADE,
        related_name='periods'
    )
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    period_number = models.PositiveIntegerField()
    is_closed = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Fiscal Period'
        verbose_name_plural = 'Fiscal Periods'
        ordering = ['fiscal_year', 'period_number']
        unique_together = ['fiscal_year', 'period_number']
    
    def __str__(self):
        return f"{self.fiscal_year.name} - {self.name}"


class DocumentSequence(TimeStampedModel):
    """Document number sequences for auto-numbering."""
    name = models.CharField(max_length=100)
    prefix = models.CharField(max_length=20)
    suffix = models.CharField(max_length=20, blank=True)
    padding = models.PositiveIntegerField(default=6)
    current_value = models.PositiveIntegerField(default=0)
    
    # Optional branch-specific sequence
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='sequences'
    )
    
    # Document type
    document_type = models.CharField(max_length=50)
    
    # Reset settings
    reset_period = models.CharField(
        max_length=20,
        choices=[
            ('never', 'Never'),
            ('yearly', 'Yearly'),
            ('monthly', 'Monthly'),
            ('daily', 'Daily'),
        ],
        default='never'
    )
    last_reset_date = models.DateField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Document Sequence'
        verbose_name_plural = 'Document Sequences'
        unique_together = ['document_type', 'branch']
    
    def __str__(self):
        return f"{self.name} ({self.prefix})"
    
    def get_next_number(self):
        """Generate the next document number."""
        self.current_value += 1
        self.save()
        
        number = str(self.current_value).zfill(self.padding)
        return f"{self.prefix}{number}{self.suffix}"


class SystemSetting(TimeStampedModel):
    """System-wide settings."""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    
    # Setting type for proper parsing
    SETTING_TYPES = [
        ('string', 'String'),
        ('integer', 'Integer'),
        ('decimal', 'Decimal'),
        ('boolean', 'Boolean'),
        ('json', 'JSON'),
    ]
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default='string')
    
    # Grouping
    group = models.CharField(max_length=50, default='general')
    
    # Is editable in UI?
    is_editable = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'System Setting'
        verbose_name_plural = 'System Settings'
        ordering = ['group', 'key']
    
    def __str__(self):
        return self.key


class Country(models.Model):
    """Countries for addresses."""
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100)
    phone_code = models.CharField(max_length=10, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Country'
        verbose_name_plural = 'Countries'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Region(models.Model):
    """Regions/States within a country."""
    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='regions'
    )
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Region'
        verbose_name_plural = 'Regions'
        ordering = ['country', 'name']
        unique_together = ['country', 'code']
    
    def __str__(self):
        return f"{self.name}, {self.country.code}"


class UnitOfMeasure(TimeStampedModel):
    """Units of measure for inventory."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Base unit for conversion
    base_unit = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='derived_units'
    )
    conversion_factor = models.DecimalField(max_digits=15, decimal_places=6, default=1.000000)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Unit of Measure'
        verbose_name_plural = 'Units of Measure'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class TaxCode(TimeStampedModel):
    """Tax codes and rates."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    TAX_TYPES = [
        ('vat', 'VAT'),
        ('sales', 'Sales Tax'),
        ('withholding', 'Withholding Tax'),
        ('service', 'Service Tax'),
        ('excise', 'Excise Tax'),
        ('other', 'Other'),
    ]
    tax_type = models.CharField(max_length=20, choices=TAX_TYPES, default='vat')
    
    # Accounts
    tax_account = models.CharField(max_length=50, blank=True, help_text='GL Account for tax')
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Tax Code'
        verbose_name_plural = 'Tax Codes'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.name} ({self.rate}%)"


class PaymentTerm(TimeStampedModel):
    """Payment terms for customers and vendors."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Days
    net_days = models.PositiveIntegerField(default=0, help_text='Number of days until payment is due')
    discount_days = models.PositiveIntegerField(default=0, help_text='Days within which discount applies')
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Payment Term'
        verbose_name_plural = 'Payment Terms'
        ordering = ['net_days', 'code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class PaymentMethod(TimeStampedModel):
    """Payment methods."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    PAYMENT_TYPES = [
        ('cash', 'Cash'),
        ('check', 'Check'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('ewallet', 'E-Wallet'),
        ('credit', 'Credit/AR'),
        ('other', 'Other'),
    ]
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES, default='cash')
    
    # GL Account
    gl_account = models.CharField(max_length=50, blank=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Bank(TimeStampedModel):
    """Banks for banking transactions."""
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    swift_code = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Bank'
        verbose_name_plural = 'Banks'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class BankAccount(TimeStampedModel):
    """Company bank accounts."""
    bank = models.ForeignKey(
        Bank,
        on_delete=models.PROTECT,
        related_name='accounts'
    )
    account_name = models.CharField(max_length=200)
    account_number = models.CharField(max_length=50)
    currency = models.ForeignKey(
        Currency,
        on_delete=models.PROTECT,
        related_name='bank_accounts'
    )
    
    # Branch association
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='bank_accounts'
    )
    
    # GL Account
    gl_account = models.CharField(max_length=50, blank=True)
    
    # Balance (updated by reconciliation)
    current_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Bank Account'
        verbose_name_plural = 'Bank Accounts'
        ordering = ['bank', 'account_name']
    
    def __str__(self):
        return f"{self.account_name} - {self.bank.name}"


class Attachment(TimeStampedModel):
    """File attachments for any model."""
    # Generic relation fields
    content_type = models.CharField(max_length=100)
    object_id = models.PositiveIntegerField()
    
    # File details
    file = models.FileField(upload_to='attachments/%Y/%m/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100, blank=True)
    file_size = models.PositiveIntegerField(default=0)
    
    description = models.TextField(blank=True)
    
    # Uploaded by
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_attachments'
    )
    
    class Meta:
        verbose_name = 'Attachment'
        verbose_name_plural = 'Attachments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
    
    def __str__(self):
        return self.filename
