"""
Management command to seed initial data for the ERP system.
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from core.models import (
    Branch, Department, Currency, UnitOfMeasure,
    TaxCode, PaymentTerm, PaymentMethod, Bank, Country
)
from authentication.models import Role


class Command(BaseCommand):
    help = 'Seed initial data for the ERP system'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...\n')
        
        # Create Currencies
        self.seed_currencies()
        
        # Create Countries
        self.seed_countries()
        
        # Create Units of Measure
        self.seed_units_of_measure()
        
        # Create Tax Codes
        self.seed_tax_codes()
        
        # Create Payment Terms
        self.seed_payment_terms()
        
        # Create Payment Methods
        self.seed_payment_methods()
        
        # Create Banks (Philippines)
        self.seed_banks()
        
        # Create Departments
        self.seed_departments()
        
        # Create Sample Branch
        self.seed_branches()
        
        # Create Roles
        self.seed_roles()
        
        self.stdout.write(self.style.SUCCESS('\nInitial data seeded successfully!'))

    def seed_currencies(self):
        currencies = [
            {'code': 'PHP', 'name': 'Philippine Peso', 'symbol': '₱', 'is_base': True, 'exchange_rate': 1.000000},
            {'code': 'USD', 'name': 'US Dollar', 'symbol': '$', 'is_base': False, 'exchange_rate': 0.017857},
            {'code': 'EUR', 'name': 'Euro', 'symbol': '€', 'is_base': False, 'exchange_rate': 0.016393},
            {'code': 'JPY', 'name': 'Japanese Yen', 'symbol': '¥', 'is_base': False, 'exchange_rate': 2.678571},
            {'code': 'CNY', 'name': 'Chinese Yuan', 'symbol': '¥', 'is_base': False, 'exchange_rate': 0.129310},
        ]
        for data in currencies:
            Currency.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(currencies)} currencies')

    def seed_countries(self):
        countries = [
            {'code': 'PH', 'name': 'Philippines', 'phone_code': '+63'},
            {'code': 'US', 'name': 'United States', 'phone_code': '+1'},
            {'code': 'CN', 'name': 'China', 'phone_code': '+86'},
            {'code': 'JP', 'name': 'Japan', 'phone_code': '+81'},
            {'code': 'SG', 'name': 'Singapore', 'phone_code': '+65'},
            {'code': 'MY', 'name': 'Malaysia', 'phone_code': '+60'},
            {'code': 'TH', 'name': 'Thailand', 'phone_code': '+66'},
            {'code': 'VN', 'name': 'Vietnam', 'phone_code': '+84'},
            {'code': 'ID', 'name': 'Indonesia', 'phone_code': '+62'},
            {'code': 'KR', 'name': 'South Korea', 'phone_code': '+82'},
        ]
        for data in countries:
            Country.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(countries)} countries')

    def seed_units_of_measure(self):
        units = [
            {'code': 'PCS', 'name': 'Piece'},
            {'code': 'BOX', 'name': 'Box'},
            {'code': 'SET', 'name': 'Set'},
            {'code': 'PACK', 'name': 'Pack'},
            {'code': 'DOZ', 'name': 'Dozen'},
            {'code': 'KG', 'name': 'Kilogram'},
            {'code': 'G', 'name': 'Gram'},
            {'code': 'L', 'name': 'Liter'},
            {'code': 'ML', 'name': 'Milliliter'},
            {'code': 'M', 'name': 'Meter'},
            {'code': 'CM', 'name': 'Centimeter'},
            {'code': 'SQFT', 'name': 'Square Feet'},
            {'code': 'SQM', 'name': 'Square Meter'},
            {'code': 'ROLL', 'name': 'Roll'},
            {'code': 'UNIT', 'name': 'Unit'},
        ]
        for data in units:
            UnitOfMeasure.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(units)} units of measure')

    def seed_tax_codes(self):
        taxes = [
            {'code': 'VAT12', 'name': 'VAT 12%', 'rate': 12.00, 'tax_type': 'vat'},
            {'code': 'VAT0', 'name': 'VAT 0%', 'rate': 0.00, 'tax_type': 'vat'},
            {'code': 'VATEX', 'name': 'VAT Exempt', 'rate': 0.00, 'tax_type': 'vat'},
            {'code': 'EWT1', 'name': 'EWT 1%', 'rate': 1.00, 'tax_type': 'withholding'},
            {'code': 'EWT2', 'name': 'EWT 2%', 'rate': 2.00, 'tax_type': 'withholding'},
            {'code': 'EWT5', 'name': 'EWT 5%', 'rate': 5.00, 'tax_type': 'withholding'},
            {'code': 'EWT10', 'name': 'EWT 10%', 'rate': 10.00, 'tax_type': 'withholding'},
            {'code': 'EWT15', 'name': 'EWT 15%', 'rate': 15.00, 'tax_type': 'withholding'},
        ]
        for data in taxes:
            TaxCode.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(taxes)} tax codes')

    def seed_payment_terms(self):
        terms = [
            {'code': 'CASH', 'name': 'Cash', 'net_days': 0},
            {'code': 'COD', 'name': 'Cash on Delivery', 'net_days': 0},
            {'code': 'NET7', 'name': 'Net 7 Days', 'net_days': 7},
            {'code': 'NET15', 'name': 'Net 15 Days', 'net_days': 15},
            {'code': 'NET30', 'name': 'Net 30 Days', 'net_days': 30},
            {'code': 'NET45', 'name': 'Net 45 Days', 'net_days': 45},
            {'code': 'NET60', 'name': 'Net 60 Days', 'net_days': 60},
            {'code': '2/10NET30', 'name': '2% 10 Net 30', 'net_days': 30, 'discount_days': 10, 'discount_percent': 2.00},
        ]
        for data in terms:
            PaymentTerm.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(terms)} payment terms')

    def seed_payment_methods(self):
        methods = [
            {'code': 'CASH', 'name': 'Cash', 'payment_type': 'cash'},
            {'code': 'CHECK', 'name': 'Check', 'payment_type': 'check'},
            {'code': 'PDC', 'name': 'Post-Dated Check', 'payment_type': 'check'},
            {'code': 'BANK', 'name': 'Bank Transfer', 'payment_type': 'bank_transfer'},
            {'code': 'VISA', 'name': 'Visa', 'payment_type': 'credit_card'},
            {'code': 'MC', 'name': 'Mastercard', 'payment_type': 'credit_card'},
            {'code': 'AMEX', 'name': 'American Express', 'payment_type': 'credit_card'},
            {'code': 'GCASH', 'name': 'GCash', 'payment_type': 'ewallet'},
            {'code': 'MAYA', 'name': 'Maya', 'payment_type': 'ewallet'},
            {'code': 'GRAB', 'name': 'GrabPay', 'payment_type': 'ewallet'},
            {'code': 'CREDIT', 'name': 'Credit/AR', 'payment_type': 'credit'},
        ]
        for data in methods:
            PaymentMethod.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(methods)} payment methods')

    def seed_banks(self):
        banks = [
            {'code': 'BDO', 'name': 'BDO Unibank', 'swift_code': 'BNORPHMM'},
            {'code': 'BPI', 'name': 'Bank of the Philippine Islands', 'swift_code': 'BABOROPHXXX'},
            {'code': 'MBT', 'name': 'Metrobank', 'swift_code': 'MBTCPHMM'},
            {'code': 'LBP', 'name': 'Land Bank of the Philippines', 'swift_code': 'TLBPPHMM'},
            {'code': 'PNB', 'name': 'Philippine National Bank', 'swift_code': 'PNBMPHMM'},
            {'code': 'RCBC', 'name': 'Rizal Commercial Banking Corporation', 'swift_code': 'RCBCPHMM'},
            {'code': 'SBC', 'name': 'Security Bank', 'swift_code': 'SETCPHMM'},
            {'code': 'UCPB', 'name': 'United Coconut Planters Bank', 'swift_code': 'UCPBPHMM'},
            {'code': 'EWB', 'name': 'EastWest Bank', 'swift_code': 'EWBCPHMM'},
            {'code': 'UBP', 'name': 'UnionBank of the Philippines', 'swift_code': 'UBPHPHMM'},
            {'code': 'CBC', 'name': 'China Banking Corporation', 'swift_code': 'CHBKPHMM'},
            {'code': 'PSB', 'name': 'Philippine Savings Bank', 'swift_code': 'PHSBPHMM'},
        ]
        for data in banks:
            Bank.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(banks)} banks')

    def seed_departments(self):
        departments = [
            {'code': 'EXEC', 'name': 'Executive Office', 'description': 'Executive Management'},
            {'code': 'SALES', 'name': 'Sales Department', 'description': 'Sales and Customer Relations'},
            {'code': 'PURCH', 'name': 'Purchasing Department', 'description': 'Procurement and Supplier Management'},
            {'code': 'INV', 'name': 'Inventory Department', 'description': 'Warehouse and Inventory Management'},
            {'code': 'FIN', 'name': 'Finance Department', 'description': 'Financial Management and Accounting'},
            {'code': 'HR', 'name': 'Human Resources', 'description': 'Employee Management and Payroll'},
            {'code': 'IT', 'name': 'Information Technology', 'description': 'IT Support and Development'},
            {'code': 'OPS', 'name': 'Operations', 'description': 'Day-to-day Operations'},
            {'code': 'MKTG', 'name': 'Marketing', 'description': 'Marketing and Promotions'},
            {'code': 'QC', 'name': 'Quality Control', 'description': 'Quality Assurance'},
        ]
        for data in departments:
            Department.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(departments)} departments')

    def seed_branches(self):
        branches = [
            {
                'code': 'HQ',
                'name': 'Head Office',
                'address': '123 Main Street',
                'city': 'Makati City',
                'province': 'Metro Manila',
                'zip_code': '1200',
                'phone': '+63 2 8888 8888',
                'email': 'headoffice@erp.com',
                'is_main': True,
            },
        ]
        for data in branches:
            Branch.objects.get_or_create(code=data['code'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(branches)} branches')

    def seed_roles(self):
        roles = [
            {
                'name': 'Administrator',
                'description': 'Full system access',
                'permissions': {'all': True}
            },
            {
                'name': 'Branch Manager',
                'description': 'Branch-level access to all modules',
                'permissions': {
                    'sales': True, 'inventory': True, 'purchasing': True,
                    'reports': True, 'hr': True
                }
            },
            {
                'name': 'Sales Staff',
                'description': 'Access to sales and customer modules',
                'permissions': {'sales': True, 'customers': True, 'products': ['view']}
            },
            {
                'name': 'Inventory Staff',
                'description': 'Access to inventory and warehouse modules',
                'permissions': {'inventory': True, 'products': True, 'warehouse': True}
            },
            {
                'name': 'Purchasing Staff',
                'description': 'Access to purchasing and vendor modules',
                'permissions': {'purchasing': True, 'vendors': True, 'products': ['view']}
            },
            {
                'name': 'Accountant',
                'description': 'Access to finance and accounting modules',
                'permissions': {
                    'accounting': True, 'finance': True, 'reports': True,
                    'sales': ['view'], 'purchasing': ['view']
                }
            },
            {
                'name': 'HR Staff',
                'description': 'Access to HR and payroll modules',
                'permissions': {'hr': True, 'payroll': True}
            },
            {
                'name': 'Cashier',
                'description': 'POS and cash management access',
                'permissions': {'pos': True, 'cash': True}
            },
        ]
        for data in roles:
            Role.objects.get_or_create(name=data['name'], defaults=data)
        self.stdout.write(f'  ✓ Created {len(roles)} roles')
