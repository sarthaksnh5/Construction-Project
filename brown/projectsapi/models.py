from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
# from sqlalchemy import true

User = get_user_model()
paymentType = (
    (1, 'IN'),
    (2, 'OUT')
)

materialType = (
    (0, 'Electrical'),
    (1, 'Modelling'),
    (2, 'Building')
)

taskUpdate = (
    (0, 'InComplete'),
    (1, 'Complete')
)

projectType = (
    (0, 'Turn Key'),
    (1, 'Labour Rate'),
)

# Create your models here.


class Project(models.Model):
    name = models.CharField(max_length=200)
    customer = models.OneToOneField(User, on_delete=models.PROTECT)
    progress = models.CharField(max_length=4, default=0, blank=True)
    status = models.CharField(max_length=1, default=1, blank=True)
    location = models.TextField()
    types = models.CharField(choices=projectType, max_length=4)
    startDate = models.DateField()
    endDate = models.DateField()


def projectDirectoryPath(instance, filename):
    return 'project/{0}/{1}'.format(instance.project.name, filename)


class ProjectDocuments(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    filename = models.CharField(max_length=200)
    document = models.FileField(upload_to=projectDirectoryPath)
    currDate = models.DateTimeField(auto_now=True)


class ProjectPM(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    project = models.ForeignKey(Project, on_delete=models.PROTECT)


class ProjectSE(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    project = models.ForeignKey(Project, on_delete=models.PROTECT)


class ProjectC(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    project = models.ForeignKey(Project, on_delete=models.PROTECT)


class ProjectI(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    project = models.ForeignKey(Project, on_delete=models.PROTECT)


class ProjectPayment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    date = models.DateField(auto_now=True)
    user = models.CharField(max_length=25)
    description = models.CharField(max_length=25)
    type = models.CharField(max_length=2, choices=paymentType)
    amount = models.CharField(max_length=200)


class ProjectMaterial(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    name = models.CharField(max_length=200, unique=True)
    dimensions = models.CharField(max_length=60)
    description = models.CharField(max_length=200, blank=True)
    date = models.DateField(auto_now=True)
    tag = models.CharField(max_length=200, choices=materialType)


class ProjectMaterialData(models.Model):
    projectMaterial = models.ForeignKey(
        ProjectMaterial, on_delete=models.PROTECT)
    date = models.DateField(auto_now=True)
    description = models.CharField(max_length=1000)
    type = models.CharField(max_length=2, choices=paymentType)
    amount = models.CharField(max_length=200)


class ProjectTask(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    startDate = models.DateField()
    endDate = models.DateField()
    name = models.CharField(max_length=200)
    status = models.CharField(choices=taskUpdate, max_length=2)


class TaskUpdate(models.Model):
    task = models.ForeignKey(ProjectTask, on_delete=models.PROTECT)
    date = models.DateField(auto_now=True)
    description = models.TextField()
    progress = models.CharField(max_length=3)


def imageDirectoryPath(instance, filename):
    return 'project/{0}/{1}/{2}'.format(instance.taskUpdate.task.project.customer.name, instance.taskUpdate.task.project.name, filename)


class TaskPhotos(models.Model):
    taskUpdate = models.ForeignKey(TaskUpdate, on_delete=models.PROTECT)
    photo = models.FileField(upload_to=imageDirectoryPath)
    date = models.DateField(auto_now=True)


def create_profile(sender, **kwargs):
    user = kwargs['instance']
    if kwargs['created']:
        TaskUpdate.objects.create(
            task=user, description="First Description need to be uploaded", progress=0)


class ChatRoom(models.Model):
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)


def createChatPhoto(instance, filename):
    return '{0}/{1}_on_{2}/{3}'.format(instance.chatRoom.name, instance.sender.name, instance.date, filename)


class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.PROTECT)
    message = models.TextField(blank=True)
    photo = models.ImageField(blank=True, upload_to=createChatPhoto)
    date = models.DateTimeField(auto_now_add=True)
    chatRoom = models.ForeignKey(Project, on_delete=models.PROTECT)


def createChatRoom(sender, **kwargs):
    user = kwargs['instance'].user
    project = kwargs['instance'].project
    if kwargs['created']:
        ChatRoom.objects.create(project=project, user=user)


def createCustomerChatRoom(sender, **kwargs):
    project = kwargs['instance']
    user = project.customer
    if kwargs['created']:
        ChatRoom.objects.create(project=project, user=user)


class LabourTable(models.Model):
    fullname = models.CharField(max_length=200, unique=True)
    age = models.CharField(max_length=200)
    addedon = models.DateField(auto_now_add=True)


class AttendaceTable(models.Model):
    name = models.ForeignKey(LabourTable, on_delete=models.PROTECT)
    hours = models.CharField(blank=True, max_length=200)
    project = models.ForeignKey(Project, on_delete=models.PROTECT)
    onDate = models.DateField(blank=False)


post_save.connect(create_profile, sender=ProjectTask)
post_save.connect(createChatRoom, sender=ProjectPM)
post_save.connect(createChatRoom, sender=ProjectSE)
post_save.connect(createChatRoom, sender=ProjectC)
post_save.connect(createChatRoom, sender=ProjectI)
post_save.connect(createCustomerChatRoom, sender=Project)
