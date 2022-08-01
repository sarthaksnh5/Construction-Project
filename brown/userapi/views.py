from brown import settings
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser, JSONParser
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from projectsapi.models import Project
from userapi.models import AdminProfile, ContractorProfile, CustomerProfile, InventoryProfile, NotificationTable, ProjectManagerProfile, SiteEngineerProfile
from django.core.mail import send_mail
from userapi.serializers import ChangePasswordSerializer, NotificationUpdateSerializer, UserSerializers
from django.contrib.auth import authenticate

User = get_user_model()
subject = "Welcome on Board"
body = """
Welcome to the company

We are glad to inform you that your email and password have been made. These are your following credentails
"""

body2 = """
Please change your password after your first login!

Thanks Regards
Company
Building Dreams
"""

# Create your views here.
data = {
    'result': False,
    'message': '',
}

base_url = settings.APP_BASE_URL


@method_decorator(csrf_exempt, name='dispatch')
class UserSignView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        try:

            if request.GET['filter'] == '1':
                resp_data = []
                users = User.objects.filter(type=request.GET['type'])
                for user in users:
                    tempData = {
                        'label': user.name, 'value': user.id
                    }
                    resp_data.append(tempData)

                data['message'] = resp_data
                data['result'] = True
            else:
                email = request.GET['email']
                password = request.GET['password']

                user = authenticate(email=email, password=password)
                if user is not None:
                    if user.type == 1:
                        project = Project.objects.get(customer=user)
                        resData = {
                            'name': user.name,
                            'email': user.email,
                            'type': user.type,
                            'id': user.id,
                            'project_id': project.id,
                            'projectType': project.types
                        }
                    else:
                        resData = {
                            'name': user.name,
                            'email': user.email,
                            'type': user.type,
                            'id': user.id,
                        }

                    data['message'] = resData
                    data['result'] = True
                else:
                    data['message'] = 'Username/Password is incorrect'
                    data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            if not 'filter' in request.data:
                userSerializer = UserSerializers(data=request.data)
                if userSerializer.is_valid():
                    finalBody = body + '\nEmail: ' + request.data['email'] + \
                        '\npassword: ' + \
                        request.data['password'] + '\n' + body2
                    send_mail(subject=subject, message=finalBody, from_email=settings.EMAIL_HOST_USER, recipient_list=[
                              request.data['email']])
                    user = userSerializer.save()
                    user.set_password(user.password)
                    user.save()
                    data['message'] = 'User Added'
                    data['result'] = True
                else:
                    data['message'] = userSerializer.errors
                    data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = True

        return JsonResponse(data)


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            # serializer.is_valid(raise_exception=True)
            if serializer.is_valid():
                user = serializer.save()
                data['message'] = 'Password Changed'
                data['result'] = True
            else:
                print(serializer.errors['non_field_errors'])
                data['message'] = serializer.errors['non_field_errors']
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)


class EmployeeDataView(APIView):
    parser_classes = (MultiPartParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            if 'id' in request.GET:
                id = request.GET['id']
                user = User.objects.get(id=id)
                if user is not None:
                    if user.type != 1:
                        employee = ""

                        if user.type == 0:
                            employee = AdminProfile.objects.get(user=user)
                        elif user.type == 2:
                            employee = SiteEngineerProfile.objects.get(
                                user=user)
                        elif user.type == 3:
                            employee = ProjectManagerProfile.objects.get(
                                user=user)
                        elif user.type == 4:
                            employee = InventoryProfile.objects.get(user=user)
                        elif user.type == 5:
                            employee = ContractorProfile.objects.get(user=user)

                        respData = {
                            'email': user.email,
                            'image': base_url + str(employee.image),
                            'mobile': employee.mobile,
                            'address': employee.address,
                            'name': user.name,
                        }
                    else:
                        customer = CustomerProfile.objects.get(user=user)
                        respData = {
                            'email': user.email,
                            'image': base_url + str(customer.image),
                            'mobile': customer.mobile,
                            'address': customer.address,
                            'fatherName': customer.fatherName,
                            'idNum': customer.idNum,
                            'idProof': str(customer.idProof),
                            'name': user.name,
                        }

                    data['message'] = respData
                    data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def put(self, request, *args, **kwargs):
        try:
            # print(request.data)
            user = User.objects.get(id=request.data.get('id'))
            employee = None
            if user.type != 1:
                if user.type == 0:
                    employee = AdminProfile.objects.get(user=user)
                elif user.type == 2:
                    employee = SiteEngineerProfile.objects.get(user=user)
                elif user.type == 3:
                    employee = ProjectManagerProfile.objects.get(user=user)
                elif user.type == 4:
                    employee = InventoryProfile.objects.get(user=user)
                elif user.type == 5:
                    employee = ContractorProfile.objects.get(user=user)

                user.email = request.data.get('email')
                user.name = request.data.get('name')
                employee.mobile = request.data.get('number')
                if request.data.get('image') != False:
                    employee.image = request.data.get('image')
                employee.save()
            else:
                user.email = request.data.get('email')
                user.name = request.data.get('name')
                customer = CustomerProfile.objects.get(user=user)
                #customer.fatherName = request.data.get('fatherName')
                customer.mobile = request.data.get('number')
                if request.data.get('image') != '0':
                    customer.image = request.data.get('image')
                #customer.idNum = request.data.get('idNum')
                # if request.data.get('idProof') != False:
                 #   customer.idProof = request.data.get('idProof')

                customer.save()

            user.save()
            resData = {
                'name': user.name,
                'email': user.email,
                'type': user.type,
                'id': user.id,
            }
            data['message'] = resData
            data['result'] = True

        except Exception as e:
            print(e)
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)


class notificationGetView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.GET['user'])
            status = NotificationTable.objects.get(user=user).status
            message = NotificationTable.objects.get(user=user).message

            data['message'] = {
                'status': status,
                'body': message
            }
            data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def put(self, request, *args, **kwargs):
        try:
            user = User.objects.get(id=request.data['id'])
            notify = NotificationTable.objects.get(user=user)
            notify.status = '0'
            notify.save()
            data['message'] = 1
            data['result'] = True
        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)
