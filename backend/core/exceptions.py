"""
Custom exception handlers for the ERP system.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent API responses.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the response format
        custom_response_data = {
            'success': False,
            'message': '',
            'errors': None,
        }
        
        # Handle different response structures
        if isinstance(response.data, dict):
            # Check for 'detail' key (common in DRF errors)
            if 'detail' in response.data:
                custom_response_data['message'] = str(response.data['detail'])
            else:
                # Field errors
                custom_response_data['message'] = 'Validation error'
                custom_response_data['errors'] = response.data
        elif isinstance(response.data, list):
            custom_response_data['message'] = str(response.data[0]) if response.data else 'An error occurred'
        else:
            custom_response_data['message'] = str(response.data)
        
        response.data = custom_response_data
    
    return response
