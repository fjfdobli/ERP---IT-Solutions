"""
Views for Core app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import (
    Branch, Department, Warehouse, Currency, FiscalYear, FiscalPeriod,
    DocumentSequence, SystemSetting, Country, Region, UnitOfMeasure,
    TaxCode, PaymentTerm, PaymentMethod, Bank, BankAccount, Attachment
)
from .serializers import (
    BranchSerializer, DepartmentSerializer, WarehouseSerializer,
    CurrencySerializer, FiscalYearSerializer, FiscalPeriodSerializer,
    DocumentSequenceSerializer, SystemSettingSerializer, CountrySerializer,
    RegionSerializer, UnitOfMeasureSerializer, TaxCodeSerializer,
    PaymentTermSerializer, PaymentMethodSerializer, BankSerializer,
    BankAccountSerializer, AttachmentSerializer
)


class BaseViewSet(viewsets.ModelViewSet):
    """Base viewset with standard response formatting."""
    permission_classes = [IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            return Response({
                'success': True,
                'data': response.data
            })
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        
        return Response({
            'success': True,
            'message': f'{self.get_model_name()} created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'success': True,
            'message': f'{self.get_model_name()} updated successfully',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        
        return Response({
            'success': True,
            'message': f'{self.get_model_name()} deleted successfully'
        })
    
    def get_model_name(self):
        return self.queryset.model._meta.verbose_name.title()


class BranchViewSet(BaseViewSet):
    """ViewSet for Branch management."""
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    filterset_fields = ['is_active', 'is_main', 'city', 'province']
    search_fields = ['code', 'name', 'city']
    ordering_fields = ['code', 'name', 'created_at']
    ordering = ['name']


class DepartmentViewSet(BaseViewSet):
    """ViewSet for Department management."""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    filterset_fields = ['is_active', 'parent']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['name']


class WarehouseViewSet(BaseViewSet):
    """ViewSet for Warehouse management."""
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    filterset_fields = ['is_active', 'branch', 'warehouse_type']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name', 'branch']
    ordering = ['branch', 'name']


class CurrencyViewSet(BaseViewSet):
    """ViewSet for Currency management."""
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    filterset_fields = ['is_active', 'is_base']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['-is_base', 'code']
    
    @action(detail=False, methods=['get'])
    def base_currency(self, request):
        """Get base currency."""
        base = Currency.objects.filter(is_base=True).first()
        if base:
            serializer = self.get_serializer(base)
            return Response({
                'success': True,
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'No base currency configured'
        }, status=status.HTTP_404_NOT_FOUND)


class FiscalYearViewSet(BaseViewSet):
    """ViewSet for Fiscal Year management."""
    queryset = FiscalYear.objects.all()
    serializer_class = FiscalYearSerializer
    filterset_fields = ['is_closed', 'is_current']
    search_fields = ['name']
    ordering_fields = ['start_date', 'name']
    ordering = ['-start_date']
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current fiscal year."""
        current = FiscalYear.objects.filter(is_current=True).first()
        if current:
            serializer = self.get_serializer(current)
            return Response({
                'success': True,
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'No current fiscal year set'
        }, status=status.HTTP_404_NOT_FOUND)


class FiscalPeriodViewSet(BaseViewSet):
    """ViewSet for Fiscal Period management."""
    queryset = FiscalPeriod.objects.all()
    serializer_class = FiscalPeriodSerializer
    filterset_fields = ['fiscal_year', 'is_closed']
    search_fields = ['name']
    ordering_fields = ['start_date', 'period_number']
    ordering = ['fiscal_year', 'period_number']


class DocumentSequenceViewSet(BaseViewSet):
    """ViewSet for Document Sequence management."""
    queryset = DocumentSequence.objects.all()
    serializer_class = DocumentSequenceSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filterset_fields = ['is_active', 'document_type', 'branch']
    search_fields = ['name', 'prefix']
    ordering_fields = ['name', 'document_type']
    ordering = ['document_type', 'name']
    
    @action(detail=True, methods=['post'])
    def generate_next(self, request, pk=None):
        """Generate next document number."""
        sequence = self.get_object()
        next_number = sequence.get_next_number()
        return Response({
            'success': True,
            'data': {
                'document_number': next_number
            }
        })


class SystemSettingViewSet(BaseViewSet):
    """ViewSet for System Setting management."""
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filterset_fields = ['group', 'setting_type', 'is_editable']
    search_fields = ['key', 'description']
    ordering_fields = ['group', 'key']
    ordering = ['group', 'key']
    
    @action(detail=False, methods=['get'])
    def by_group(self, request):
        """Get settings grouped by group."""
        settings = SystemSetting.objects.all().order_by('group', 'key')
        grouped = {}
        for setting in settings:
            if setting.group not in grouped:
                grouped[setting.group] = []
            grouped[setting.group].append(SystemSettingSerializer(setting).data)
        
        return Response({
            'success': True,
            'data': grouped
        })


class CountryViewSet(BaseViewSet):
    """ViewSet for Country management."""
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filterset_fields = ['is_active']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['name']


class RegionViewSet(BaseViewSet):
    """ViewSet for Region management."""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    filterset_fields = ['is_active', 'country']
    search_fields = ['code', 'name']
    ordering_fields = ['name']
    ordering = ['country', 'name']


class UnitOfMeasureViewSet(BaseViewSet):
    """ViewSet for Unit of Measure management."""
    queryset = UnitOfMeasure.objects.all()
    serializer_class = UnitOfMeasureSerializer
    filterset_fields = ['is_active', 'base_unit']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['name']


class TaxCodeViewSet(BaseViewSet):
    """ViewSet for Tax Code management."""
    queryset = TaxCode.objects.all()
    serializer_class = TaxCodeSerializer
    filterset_fields = ['is_active', 'tax_type']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name', 'rate']
    ordering = ['code']


class PaymentTermViewSet(BaseViewSet):
    """ViewSet for Payment Term management."""
    queryset = PaymentTerm.objects.all()
    serializer_class = PaymentTermSerializer
    filterset_fields = ['is_active']
    search_fields = ['code', 'name']
    ordering_fields = ['net_days', 'code']
    ordering = ['net_days', 'code']


class PaymentMethodViewSet(BaseViewSet):
    """ViewSet for Payment Method management."""
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    filterset_fields = ['is_active', 'payment_type']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name']
    ordering = ['name']


class BankViewSet(BaseViewSet):
    """ViewSet for Bank management."""
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    filterset_fields = ['is_active']
    search_fields = ['code', 'name', 'swift_code']
    ordering_fields = ['code', 'name']
    ordering = ['name']


class BankAccountViewSet(BaseViewSet):
    """ViewSet for Bank Account management."""
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    filterset_fields = ['is_active', 'is_default', 'bank', 'branch', 'currency']
    search_fields = ['account_name', 'account_number']
    ordering_fields = ['bank', 'account_name']
    ordering = ['bank', 'account_name']


class AttachmentViewSet(BaseViewSet):
    """ViewSet for Attachment management."""
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    filterset_fields = ['content_type', 'object_id']
    search_fields = ['filename', 'description']
    ordering_fields = ['created_at', 'filename']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        if file:
            serializer.save(
                uploaded_by=self.request.user,
                filename=file.name,
                file_size=file.size,
                file_type=file.content_type
            )
        else:
            serializer.save(uploaded_by=self.request.user)
