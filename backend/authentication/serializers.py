"""
Serializers for Authentication app.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Role, UserRole, AuditLog

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to include user data."""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'full_name': self.user.full_name,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
        }
        
        # Get user roles
        roles = Role.objects.filter(user_roles__user=self.user, is_active=True)
        data['user']['roles'] = [{'id': r.id, 'name': r.name} for r in roles]
        
        # Format response for frontend compatibility
        return {
            'success': True,
            'message': 'Login successful',
            'data': {
                'access_token': data['access'],
                'refresh_token': data['refresh'],
                'user': data['user']
            }
        }


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    
    roles = serializers.SerializerMethodField()
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'avatar', 'is_active', 'is_staff', 'is_superuser',
            'date_joined', 'last_login', 'branch', 'department', 'roles'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_roles(self, obj):
        roles = Role.objects.filter(user_roles__user=obj, is_active=True)
        return [{'id': r.id, 'name': r.name} for r in roles]


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating users."""
    
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    roles = serializers.ListField(child=serializers.IntegerField(), required=False)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'is_active', 'branch', 'department', 'roles'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})
        return attrs
    
    def create(self, validated_data):
        roles = validated_data.pop('roles', [])
        password = validated_data.pop('password')
        
        user = User.objects.create_user(password=password, **validated_data)
        
        # Assign roles
        for role_id in roles:
            try:
                role = Role.objects.get(id=role_id)
                UserRole.objects.create(
                    user=user,
                    role=role,
                    assigned_by=self.context['request'].user if self.context.get('request') else None
                )
            except Role.DoesNotExist:
                pass
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating users."""
    
    roles = serializers.ListField(child=serializers.IntegerField(), required=False)
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone', 'is_active',
            'branch', 'department', 'roles'
        ]
    
    def update(self, instance, validated_data):
        roles = validated_data.pop('roles', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update roles if provided
        if roles is not None:
            UserRole.objects.filter(user=instance).delete()
            for role_id in roles:
                try:
                    role = Role.objects.get(id=role_id)
                    UserRole.objects.create(
                        user=instance,
                        role=role,
                        assigned_by=self.context['request'].user if self.context.get('request') else None
                    )
                except Role.DoesNotExist:
                    pass
        
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""
    
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': 'Passwords do not match'})
        return attrs
    
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value


class RoleSerializer(serializers.ModelSerializer):
    """Serializer for the Role model."""
    
    user_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'is_active', 'created_at', 'updated_at', 'user_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_user_count(self, obj):
        return obj.user_roles.count()


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for the AuditLog model."""
    
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'user_name', 'action', 'model_name', 'object_id', 
                  'object_repr', 'changes', 'ip_address', 'timestamp']
        read_only_fields = ['id', 'timestamp']
