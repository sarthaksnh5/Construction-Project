from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.dispatch import receiver
from django.utils import timezone
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.db.models.signals import post_save

# Create your models here.
userChoices = [
    (0, 'Admin'),
    (1, 'Customer'),
    (2, 'Site Engineer'),
    (3, 'Project Manager'),
    (4, 'Inventory'),
    (5, 'Contractor'),
]

# Create your models here.


class UserManager(BaseUserManager):
    def _create_user(self, email, password, types, is_staff, is_superuser, **extra_fields):
        if not email:
            raise ValueError('User must have email address')

        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            types=types,
            last_login=now,
            date_joined=now,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, password=None, types=None, **extra_fields):
        return self._create_user(email, password, False, False, types, **extra_fields)

    def create_superuser(self, email, password, types, **extra_fields):
        user = self._create_user(
            email, password, types, True, True, **extra_fields)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=254, unique=True)
    name = models.CharField(max_length=254, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    type = models.IntegerField(choices=userChoices)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_absolute_url(self):
        return "/users/%i/" % (self.pk)

    def get_email(self):
        return self.email

    def get_name(self):
        return self.name

    def get_user_type(self):
        return self.types

    def get_password(self):
        return self.password


def customerPath(instance, filename):
    return 'customer/{0}/{1}'.format(instance.user.name, filename)


def projectPath(instance, filename):
    return 'projectManager/{0}/{1}'.format(instance.user.name, filename)


def adminPath(instance, filename):
    return 'admin/{0}/{1}'.format(instance.user.name, filename)


def sitePath(instance, filename):
    return 'siteEngineer/{0}/{1}'.format(instance.user.name, filename)


def inventoryPath(instance, filename):
    return 'Inventory/{0}/{1}'.format(instance.user.name, filename)


def contractorPath(instance, filename):
    return 'Contractor/{0}/{1}'.format(instance.user.name, filename)


def employeePath(instance, filename):
    return 'Contractor/{0}/{1}'.format(instance.user.name, filename)


class CustomerProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    image = models.ImageField(upload_to=customerPath, default='')
    fatherName = models.CharField(max_length=200, default='')
    mobile = models.CharField(max_length=10, default='0')
    address = models.TextField(default='')
    idNum = models.CharField(max_length=20, default='')
    idProof = models.FileField(upload_to=customerPath, default='')
    projectAss = models.CharField(max_length=1, default=0)


class ProjectManagerProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    image = models.ImageField(upload_to=projectPath, default='')
    mobile = models.CharField(max_length=10, default='0')
    address = models.TextField(default='')


class SiteEngineerProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    image = models.ImageField(upload_to=sitePath, default='')
    mobile = models.CharField(max_length=10, default='0')
    address = models.TextField()


class AdminProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    image = models.ImageField(upload_to=adminPath, default='')
    mobile = models.CharField(max_length=10, default='0')
    address = models.TextField()


class InventoryProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    image = models.ImageField(upload_to=inventoryPath, default='')
    mobile = models.CharField(max_length=10, default='0')
    address = models.TextField()


class ContractorProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    image = models.ImageField(upload_to=contractorPath, default='')
    mobile = models.CharField(max_length=10, default='0')
    address = models.TextField()


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    email_plaintext_message = "Hello\nYour reset password token is {}".format(
        reset_password_token.key)
    send_mail(
        # title:
        "Password Reset for {title}".format(title="Brick It"),
        # message:
        '',
        # from:
        "noreply@somehost.local",
        # to:
        [reset_password_token.user.email],

        html_message=email_plaintext_message
    )


def create_profile(sender, **kwargs):
    user = kwargs['instance']
    if user.type == 0:
        if kwargs['created']:            
            AdminProfile.objects.create(user=user)
    if user.type == 1:
        if kwargs['created']:            
            CustomerProfile.objects.create(user=user)
    if user.type == 2:
        if kwargs['created']:            
            SiteEngineerProfile.objects.create(user=user)
    if user.type == 3:
        if kwargs['created']:            
            ProjectManagerProfile.objects.create(user=user)
    if user.type == 4:
        if kwargs['created']:            
            InventoryProfile.objects.create(user=user)
    if user.type == 5:
        if kwargs['created']:            
            ContractorProfile.objects.create(user=user)

    if kwargs['created']:
        NotificationTable.objects.create(user=user)

class NotificationTable(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    status = models.CharField(default=0, max_length=1)
    message = models.CharField(max_length=200, default='')

post_save.connect(create_profile, sender=User)