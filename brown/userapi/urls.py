from django.urls import path
from . import views

urlpatterns = [
    path('user', views.UserSignView.as_view(), name='user'),
    path('changePassword', views.ChangePasswordView.as_view(), name='change'),
    path('employee', views.EmployeeDataView.as_view(), name='employee'),
    path('notification', views.notificationGetView.as_view(), name='notification')
]
