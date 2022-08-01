from django.contrib import admin
from django.contrib.auth import get_user_model

from userapi.models import AdminProfile, ContractorProfile, CustomerProfile, InventoryProfile, ProjectManagerProfile, SiteEngineerProfile
User = get_user_model()

# Register your models here.
admin.site.register(User)
admin.site.register(ProjectManagerProfile)
admin.site.register(CustomerProfile)
admin.site.register(SiteEngineerProfile)
admin.site.register(AdminProfile)
admin.site.register(InventoryProfile)
admin.site.register(ContractorProfile)