from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatMessage, LabourTable, Project, ProjectDocuments, ProjectMaterial, ProjectMaterialData, ProjectPayment, ProjectTask, TaskPhotos, TaskUpdate

User = get_user_model()


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'location', 'startDate', 'endDate', 'types']


class ProjectDocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectDocuments
        fields = ['filename', 'document']


class PaymentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectPayment
        fields = ['user', 'description', 'type', 'amount']


class MaterialSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectMaterial
        fields = ['name', 'dimensions', 'description', 'tag']


class MaterialDataSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectMaterialData
        fields = ['type', 'amount', 'description']


class ProjectTaskSeriazlier(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProjectTask
        fields = ['startDate', 'endDate', 'name', 'status']


class TaskUpdateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TaskUpdate
        fields = ['description', 'progress']


class TaskPhotoUploadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TaskPhotos
        fields = ['photo']


class ChatMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['message', 'photo']


class LabourTableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LabourTable
        fields = ['fullname', 'age']
