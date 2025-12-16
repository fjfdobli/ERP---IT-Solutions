from django.contrib import admin
from .models import (
    Branch, Department, Warehouse, Currency, FiscalYear, FiscalPeriod,
    DocumentSequence, SystemSetting, Country, Region, UnitOfMeasure,
    TaxCode, PaymentTerm, PaymentMethod, Bank, BankAccount, Attachment
)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'city', 'province', 'is_active', 'is_main')
    list_filter = ('is_active', 'is_main', 'province')
    search_fields = ('code', 'name', 'city')
    ordering = ('name',)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'parent', 'head', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name')
    ordering = ('name',)


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'branch', 'warehouse_type', 'is_active')
    list_filter = ('is_active', 'warehouse_type', 'branch')
    search_fields = ('code', 'name')
    ordering = ('branch', 'name')


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'symbol', 'exchange_rate', 'is_base', 'is_active')
    list_filter = ('is_active', 'is_base')
    search_fields = ('code', 'name')
    ordering = ('-is_base', 'code')


@admin.register(FiscalYear)
class FiscalYearAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'is_current', 'is_closed')
    list_filter = ('is_closed', 'is_current')
    search_fields = ('name',)
    ordering = ('-start_date',)


@admin.register(FiscalPeriod)
class FiscalPeriodAdmin(admin.ModelAdmin):
    list_display = ('name', 'fiscal_year', 'period_number', 'start_date', 'end_date', 'is_closed')
    list_filter = ('fiscal_year', 'is_closed')
    search_fields = ('name',)
    ordering = ('fiscal_year', 'period_number')


@admin.register(DocumentSequence)
class DocumentSequenceAdmin(admin.ModelAdmin):
    list_display = ('name', 'document_type', 'prefix', 'current_value', 'branch', 'is_active')
    list_filter = ('document_type', 'is_active', 'branch')
    search_fields = ('name', 'prefix')
    ordering = ('document_type', 'name')


@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'group', 'setting_type', 'is_editable')
    list_filter = ('group', 'setting_type', 'is_editable')
    search_fields = ('key', 'description')
    ordering = ('group', 'key')


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'phone_code', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name')
    ordering = ('name',)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'country', 'is_active')
    list_filter = ('country', 'is_active')
    search_fields = ('code', 'name')
    ordering = ('country', 'name')


@admin.register(UnitOfMeasure)
class UnitOfMeasureAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'base_unit', 'conversion_factor', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name')
    ordering = ('name',)


@admin.register(TaxCode)
class TaxCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'tax_type', 'rate', 'is_active')
    list_filter = ('tax_type', 'is_active')
    search_fields = ('code', 'name')
    ordering = ('code',)


@admin.register(PaymentTerm)
class PaymentTermAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'net_days', 'discount_days', 'discount_percent', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name')
    ordering = ('net_days', 'code')


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'payment_type', 'is_active')
    list_filter = ('payment_type', 'is_active')
    search_fields = ('code', 'name')
    ordering = ('name',)


@admin.register(Bank)
class BankAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'swift_code', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('code', 'name', 'swift_code')
    ordering = ('name',)


@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ('account_name', 'bank', 'account_number', 'currency', 'current_balance', 'is_active')
    list_filter = ('bank', 'currency', 'is_active', 'is_default')
    search_fields = ('account_name', 'account_number')
    ordering = ('bank', 'account_name')


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('filename', 'content_type', 'object_id', 'file_type', 'file_size', 'uploaded_by', 'created_at')
    list_filter = ('content_type', 'file_type')
    search_fields = ('filename', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('file_size', 'file_type', 'uploaded_by', 'created_at')
