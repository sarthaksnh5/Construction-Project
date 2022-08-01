from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import password_validation
from django.utils.translation import gettext_lazy as _

from userapi.models import CustomerProfile, NotificationTable, ProjectManagerProfile

User = get_user_model()

class UserSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'type', 'password']        

class ChangePasswordSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=128, write_only=True, required=True)
    oldPassword = serializers.CharField(max_length=128, write_only=True, required=True)
    newPassword = serializers.CharField(max_length=128, write_only=True, required=True)

    def validateOld(self, data):
        user = User.objects.filter(name=data['name']).first()        
        if user is not None:
            if not user.check_password(data['oldPassword']):            
                raise serializers.ValidationError(
                    _('Your old password was entered incorrectly. Please enter it again.')
                )
        else:
            raise serializers.ValidationError(
                _('User not found')
            )        

    def validate(self, data):
        self.validateOld(data)
        if data['oldPassword'] == data['newPassword']:
            raise serializers.ValidationError(_('Old and New Passwords can not be same'))
        password_validation.validate_password(data['newPassword'], User.objects.filter(name=data['name']).first())
        return data

    def save(self, **kwargs):
        password = self.validated_data['newPassword']
        user = User.objects.filter(name=self.validated_data['name']).first()
        user.set_password(password)
        user.save()
        return user

class CustomerSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['image', 'fatherName', 'mobile', 'address', 'idNum', 'idProof']

class ProjectManagerSerializers(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectManagerProfile
        fields = ['image', 'mobile', 'address']

class NotificationUpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = NotificationTable
        fields = ['status', 'message']