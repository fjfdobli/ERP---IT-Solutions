"""
URL Configuration for Core app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BranchViewSet, DepartmentViewSet, WarehouseViewSet, CurrencyViewSet,
    FiscalYearViewSet, FiscalPeriodViewSet, DocumentSequenceViewSet,
    SystemSettingViewSet, CountryViewSet, RegionViewSet, UnitOfMeasureViewSet,
    TaxCodeViewSet, PaymentTermViewSet, PaymentMethodViewSet, BankViewSet,
    BankAccountViewSet, AttachmentViewSet
)

router = DefaultRouter()
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'currencies', CurrencyViewSet, basename='currency')
router.register(r'fiscal-years', FiscalYearViewSet, basename='fiscal-year')
router.register(r'fiscal-periods', FiscalPeriodViewSet, basename='fiscal-period')
router.register(r'document-sequences', DocumentSequenceViewSet, basename='document-sequence')
router.register(r'system-settings', SystemSettingViewSet, basename='system-setting')
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'regions', RegionViewSet, basename='region')
router.register(r'units-of-measure', UnitOfMeasureViewSet, basename='unit-of-measure')
router.register(r'tax-codes', TaxCodeViewSet, basename='tax-code')
router.register(r'payment-terms', PaymentTermViewSet, basename='payment-term')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')
router.register(r'banks', BankViewSet, basename='bank')
router.register(r'bank-accounts', BankAccountViewSet, basename='bank-account')
router.register(r'attachments', AttachmentViewSet, basename='attachment')

urlpatterns = [
    path('', include(router.urls)),
]
