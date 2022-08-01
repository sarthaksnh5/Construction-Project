from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model
import random
from django.db.models import Sum
from brown import settings
from projectsapi.models import AttendaceTable, ChatMessage, ChatRoom, LabourTable, Project, ProjectC, ProjectDocuments, ProjectI, ProjectMaterial, ProjectMaterialData, ProjectPM, ProjectPayment, ProjectSE, ProjectTask, TaskPhotos, TaskUpdate
from projectsapi.serializers import ChatMessageSerializer, LabourTableSerializer, MaterialDataSerializer, MaterialSerializer, PaymentSerializer, ProjectDocumentSerializer, ProjectSerializer, ProjectTaskSeriazlier, TaskPhotoUploadSerializer, TaskUpdateSerializer
from projectsapi.utils import download_csv
from userapi.models import ContractorProfile, CustomerProfile, InventoryProfile, NotificationTable, ProjectManagerProfile, SiteEngineerProfile
from userapi.serializers import UserSerializers
from django.core.mail import send_mail
import datetime

f = '%Y-%m-%d'
g = '%Y-%m-%d %H:%M:%S'

User = get_user_model()
base_url = settings.APP_BASE_URL

subject = "Welcome on Board"
body = """
Welcome to the company

We are glad to inform you that your email and password have been made. These are your following credentails
"""

body2 = """
Please change your password after your first login!

Thanks Regards
BrickedIN
Building Dreams
"""

data = {
    'result': False,
    'message': '',
}

# Create your views here.


class ProjectView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            filter = request.GET['filter']
            if filter == 'single':  # specific project data
                project = Project.objects.get(id=request.GET['id'])
                documents = ProjectDocuments.objects.filter(project=project)
                docArr = []
                for document in documents:
                    resp = {
                        'id': document.id,
                        'name': document.filename,
                        'document': settings.APP_BASE_URL + str(document.document),
                        'date': document.currDate.strftime('%b %d ,%y')
                    }
                    docArr.append(resp)

                resp_data = {
                    'name': project.name,
                    'startDate': str(datetime.datetime.strptime(str(project.startDate), f).strftime('%d %b, %y')),
                    'endDate': str(datetime.datetime.strptime(str(project.endDate), f).strftime('%d %b, %y')),
                    'email': project.customer.email,
                    'owner': project.customer.name,
                    'location': project.location,
                    'docs': docArr,
                }

                data['message'] = resp_data
                data['result'] = True

            if filter == 'projects':  # multiple projects data
                user = User.objects.get(id=request.GET['id'])
                if user is not None:
                    resp_data = []
                    if user.type == 0:
                        projects = Project.objects.all().order_by('startDate')
                    elif user.type == 2:
                        projects = ProjectSE.objects.filter(
                            user=user)
                    elif user.type == 3:
                        projects = ProjectPM.objects.filter(
                            user=user)
                    elif user.type == 4:
                        projects = ProjectI.objects.filter(user=user)
                    elif user.type == 5:
                        projects = ProjectC.objects.filter(user=user)

                    if len(projects) > 0:
                        if user.type == 0:
                            for proj in projects:
                                tempData = {
                                    'id': proj.id,
                                    'projectName': proj.name,
                                    'userName': proj.customer.name,
                                    'projectComplete': proj.progress,
                                    'status': proj.status,
                                    'startDate': str(datetime.datetime.strptime(str(proj.startDate), f).strftime('%d %b, %y')),
                                    'endDate': str(datetime.datetime.strptime(str(proj.endDate), f).strftime('%d %b, %y')),
                                }
                                resp_data.append(tempData)
                        else:
                            for proj in projects:
                                tempData = {
                                    'id': proj.project.id,
                                    'projectName': proj.project.name,
                                    'userName': proj.project.customer.name,
                                    'projectComplete': proj.project.progress,
                                    'status': proj.project.status,
                                    'startDate': str(datetime.datetime.strptime(str(proj.project.startDate), f).strftime('%d %b, %y')),
                                    'endDate': str(datetime.datetime.strptime(str(proj.project.endDate), f).strftime('%d %b, %y')),
                                }
                                resp_data.append(tempData)
                    else:
                        resp_data = 0

                    data['message'] = resp_data
                    data['result'] = True

            elif filter == 'customer':  # customer specifies project data
                user = User.objects.get(id=request.GET['id'])
                project = Project.objects.get(customer=user)
                tasks = ProjectTask.objects.filter(project=project)
                completedTask = len(ProjectTask.objects.filter(
                    project=project, status=1))
                cur = datetime.date.today()
                total = project.endDate - project.startDate
                diff = project.endDate - cur
                progress = int((total.days - diff.days + 1) / total.days) * 100

                taskArr = []
                if len(tasks) > 0:
                    for task in tasks:
                        photoArr = []
                        updates = TaskUpdate.objects.filter(task=task)
                        if len(updates) > 0:
                            for update in updates:
                                photos = TaskPhotos.objects.filter(
                                    taskUpdate=update)
                                for photo in photos:
                                    photoArr.append({
                                        'id': photo.id,
                                        'uri': settings.APP_BASE_URL + str(photo.photo),
                                    })
                        taskArr.append({
                            'id': task.id,
                            'name': task.name,
                            'type': project.types,
                            'start': datetime.datetime.strptime(str(task.startDate), f).strftime('%d %b'),
                            'end': datetime.datetime.strptime(str(task.endDate), f).strftime('%d %b'),
                            'progress': updates.last().progress,
                            'photo': photoArr,
                        })

                resp_data = {
                    'id': project.id,
                    'progress': progress,
                    'date': 1,
                    'total': total.days,
                    'task': len(tasks),
                    'completedTask': completedTask,
                    'tasks': taskArr,
                }

                data['message'] = resp_data
                data['result'] = True

            elif filter == 'photos':
                user = User.objects.get(id=request.GET['id'])
                project = Project.objects.get(customer=user)
                tasks = ProjectTask.objects.filter(project=project)
                photoArr = []
                if len(tasks) > 0:
                    for task in tasks:
                        updates = TaskUpdate.objects.filter(task=task)
                        if len(updates) > 0:
                            for update in updates:
                                photos = TaskPhotos.objects.filter(
                                    taskUpdate=update)
                                for photo in photos:
                                    photoArr.append({
                                        'id': photo.id,
                                        'uri': settings.APP_BASE_URL + str(photo.photo),
                                        'date': photo.date.strftime('%d %b, %y'),
                                    })

                respData = {
                    'photos': photoArr
                }
                data['message'] = respData
                data['result'] = True

        except Exception as e:
            print(e)
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            
            serializerData = {
                'email': request.data['ownerEmail'],
                'name': request.data['ownerName'],
                'type': 1,
                'password': str(request.data['ownerName']) + str(random.randint(10000, 99999))
            }
            userSerializer = UserSerializers(data=serializerData)
            if userSerializer.is_valid():
                user = userSerializer.save()
                user.set_password(user.password)
                user.save()
                serializer = ProjectSerializer(data=request.data)
                if serializer.is_valid():
                    finalData = body + "email: " + \
                        str(user.email) + "\npassword: " + \
                        str(serializerData['password']) + "\n" + body2

                    send_mail(
                        subject=subject,
                        message=finalData,
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[user.email]
                    )
                    CustomerProfile.objects.filter(user=user).update(
                        projectAss=1,
                    )
                    serializer.save(customer=user)

                    data['message'] = '1'
                    data['result'] = True
                else:
                    data['message'] = serializer.errors
                    data['result'] = False
            else:
                data['message'] = 'User: ' + str(userSerializer.errors)
                print('User: ' + str(userSerializer.errors))
                data['result'] = False

        except Exception as e:
            print(e)
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def put(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=request.data.get('id'))
            user = project.customer
            project.name = request.data.get('name')
            project.location = request.data.get('location')
            project.startDate = request.data.get('startDate')
            project.endDate = request.data.get('endDate')
            user.email = request.data.get('email')
            user.name = request.data.get('owner')

            project.save()
            user.save()

            data['message'] = 1
            data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)


class TeamDataView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=request.GET['id'])

            pms = ProjectPM.objects.filter(project=project)
            ses = ProjectSE.objects.filter(project=project)
            cs = ProjectC.objects.filter(project=project)
            iss = ProjectI.objects.filter(project=project)
            id = 0
            resp_data = []
            for pm in pms:
                mobile = ProjectManagerProfile.objects.get(
                    user=pm.user)
                tempData = {
                    'name': pm.user.name, 'id': id, 'mobile': mobile.mobile, 'position': 'Project Manager'
                }
                id += 1
                resp_data.append(tempData)

            for se in ses:
                mobile = SiteEngineerProfile.objects.get(
                    user=se.user)
                tempData = {
                    'id': id, 'name': se.user.name, 'mobile': mobile.mobile, 'position': 'Site Engineer'
                }
                id += 1
                resp_data.append(tempData)

            for c in cs:
                mobile = ContractorProfile.objects.get(user=c.user)
                tempData = {
                    'id': id, 'name': c.user.name, 'mobile': mobile.mobile, 'position': 'Contractor'
                }
                id += 1
                resp_data.append(tempData)

            for i in iss:
                mobile = InventoryProfile.objects.get(user=i.user)
                tempData = {
                    'id': id, 'name': i.user.name, 'mobile': mobile.mobile, 'position': 'Inventory'
                }
                id += 1
                resp_data.append(tempData)

            data['message'] = resp_data
            data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            type = str(request.data['type'])
            project = Project.objects.get(id=request.data['project'])
            user = User.objects.get(id=request.data['user'])
            flag = 1
            if type == '2':
                ProjectSE.objects.create(user=user, project=project)
            elif type == '3':
                ProjectPM.objects.create(user=user, project=project)
            elif type == '4':
                ProjectI.objects.create(user=user, project=project)
            elif type == '5':
                ProjectC.objects.create(user=user, project=project)
            else:
                flag = 0

            if flag == 0:
                data['message'] = 'Empty'
                data['result'] = False
            else:
                data['message'] = 'User Added'
                data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)


class PaymentDataView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=request.GET['id'])
            payments = ProjectPayment.objects.filter(project=project)
            if len(payments) > 0:
                outBalance = ProjectPayment.objects.filter(
                    project=project, type=2).aggregate(Sum('amount'))['amount__sum']
                if outBalance == None:
                    outBalance = 0
                inBalance = ProjectPayment.objects.filter(
                    project=project, type=1).aggregate(Sum('amount'))['amount__sum']
                if inBalance == None:
                    inBalance = 0
                balance = int(inBalance) - int(outBalance)

                tempData = []
                for payment in payments:

                    newData = datetime.datetime.strptime(str(payment.date), f)
                    temp = {
                        'id': payment.id,
                        'date': str(newData.strftime('%d %b, %Y')),
                        'type': payment.type,
                        'amount': payment.amount,
                        'description': payment.description,
                        'user': payment.user,
                    }
                    tempData.append(temp)

                temp = {
                    'outBalance': str(outBalance),
                    'inBalance': str(inBalance),
                    'balanceL': str(balance),
                    'data': tempData,
                }

                data['message'] = temp
                data['result'] = True
            else:
                data['message'] = '0'
                data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            paymentSeriazlier = PaymentSerializer(data=request.data)
            if paymentSeriazlier.is_valid():
                project = Project.objects.get(id=request.data['project'])
                paymentSeriazlier.save(project=project)
                data['message'] = 1
                data['result'] = True
            else:
                data['message'] = str(paymentSeriazlier.errors)
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)


class MaterialDataView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            id = request.GET['id']
            project = Project.objects.get(id=id)
            materials = ProjectMaterial.objects.filter(project=project)
            responDate = []
            if len(materials) > 0:
                for material in materials:
                    inM = ProjectMaterialData.objects.filter(
                        projectMaterial=material, type=1).aggregate(Sum('amount'))['amount__sum']
                    if inM == None:
                        inM = 0

                    outM = ProjectMaterialData.objects.filter(
                        projectMaterial=material, type=2).aggregate(Sum('amount'))['amount__sum']
                    if outM == None:
                        outM = 0

                    balance = int(inM) - int(outM)
                    tempData = {
                        'id': material.id,
                        'material': material.name,
                        'tagType': int(material.tag),
                        'total': inM,
                        'left': balance,
                    }
                    responDate.append(tempData)

            data['message'] = responDate
            data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            serializer = MaterialSerializer(data=request.data)
            if serializer.is_valid():
                project = Project.objects.get(id=request.data['id'])
                serializer.save(project=project)

                data['message'] = 'Material Added'
                data['result'] = True

            else:
                data['message'] = serializer.errors
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)


class MaterialQuantityView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            material = ProjectMaterial.objects.get(id=request.GET['id'])
            materialEntries = ProjectMaterialData.objects.filter(
                projectMaterial=material)
            if len(materialEntries) > 0:
                inM = ProjectMaterialData.objects.filter(
                    projectMaterial=material, type=1).aggregate(Sum('amount'))['amount__sum']
                if inM == None:
                    inM = 0

                outM = ProjectMaterialData.objects.filter(
                    projectMaterial=material, type=2).aggregate(Sum('amount'))['amount__sum']
                if outM == None:
                    outM = 0

                balance = int(inM) - int(outM)
                temp = []
                for entry in materialEntries:
                    tempData = {
                        'id': entry.id,
                        'date': str(datetime.datetime.strptime(str(entry.date), f).strftime('%d %b, %Y')),
                        'description': entry.description,
                        'type': entry.type,
                        'amount': entry.amount,
                    }
                    temp.append(tempData)

                responseData = {
                    'balance': balance,
                    'inBalance': inM,
                    'outBalance': outM,
                    'data': temp
                }

                data['message'] = responseData
                data['result'] = True
            else:
                data['message'] = 0
                data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            serializer = MaterialDataSerializer(data=request.data)
            if serializer.is_valid():
                projectMaterial = ProjectMaterial.objects.get(
                    id=request.data['id'])
                serializer.save(projectMaterial=projectMaterial)

                data['message'] = 1
                data['result'] = True

            else:
                data['message'] = serializer.errors
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            print(e)
            data['result'] = False

        return JsonResponse(data)


class TaskDataView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            id = request.GET['id']
            project = Project.objects.get(id=id)
            tasks = ProjectTask.objects.filter(project=project)
            complete = len(ProjectTask.objects.filter(
                project=project, status=1))
            incomplete = len(ProjectTask.objects.filter(
                project=project, status=0))
            total = len(tasks)
            if len(tasks) > 0:
                temp = []
                for task in tasks:
                    taskUpdate = TaskUpdate.objects.filter(task=task).last()
                    tempData = {
                        'id': task.id,
                        'name': task.name,
                        'start': datetime.datetime.strptime(str(task.startDate), f).strftime('%d %b'),
                        'end': datetime.datetime.strptime(str(task.endDate), f).strftime('%d %b'),
                        'progress': taskUpdate.progress
                    }
                    temp.append(tempData)

                responseData = {
                    'totalTask': total,
                    'taskComplete': complete,
                    'taskinComplete': incomplete,
                    'taskData': temp
                }

                data['message'] = responseData
                data['result'] = True

            else:
                data['message'] = 0
                data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False
            print(e)

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            serializer = ProjectTaskSeriazlier(data=request.data)
            if serializer.is_valid():
                project = Project.objects.get(id=request.data['id'])
                serializer.save(project=project)

                customerNotify = NotificationTable.objects.get(
                    user=project.customer)
                customerNotify.status = 1
                customerNotify.message = 'New Task added'

                data['message'] = 1
                data['result'] = True
            else:
                data['message'] = serializer.errors
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False
            print(e)

        return JsonResponse(data)


class TaskUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            id = request.GET['id']
            task = ProjectTask.objects.get(id=id)
            start = datetime.datetime.strptime(
                str(task.startDate), f).strftime('%d %b')
            end = datetime.datetime.strptime(
                str(task.endDate), f).strftime('%d %b')
            update = TaskUpdate.objects.filter(task=task).last()
            if update != None:
                progress = update.progress
                description = update.description
                photos = TaskPhotos.objects.filter(taskUpdate=update)
                photosData = []
                for photo in photos:
                    temp = {
                        'uri': base_url + str(photo.photo)
                    }
                    photosData.append(temp)

                finalData = {
                    'startDate': start,
                    'endDate': end,
                    'progressValue': progress,
                    'descriptionValue': description,
                    'photosArray': photosData
                }

                data['message'] = finalData
                data['result'] = True

            else:
                data['message'] = 2
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False
            print(e)

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:

            updateSeriazlier = TaskUpdateSerializer(data=request.data)
            if updateSeriazlier.is_valid():
                task = ProjectTask.objects.get(id=request.data['id'])
                updated = updateSeriazlier.save(task=task)
                if request.data['progress'] == '100':
                    task.status = 1
                    task.save()
                for i in range(int(request.data['count'])):
                    newData = {
                        'photo': request.FILES['photo'+str(i)]
                    }
                    photoSave = TaskPhotoUploadSerializer(data=newData)
                    if photoSave.is_valid():
                        photoSave.save(taskUpdate=updated)
                    else:
                        print(photoSave.error_messages)                

                data['message'] = 1
                data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False
            print(e)

        return JsonResponse(data)


def photoData(request):
    try:
        project = Project.objects.get(id=request.GET['id'])
        tasks = ProjectTask.objects.filter(project=project).order_by('-id')
        responseData = []
        if len(tasks) > 0:
            for task in tasks:
                updates = TaskUpdate.objects.filter(task=task).order_by('-id')
                if len(updates):
                    for update in updates:
                        photos = TaskPhotos.objects.filter(
                            taskUpdate=update).order_by('-id')
                        if len(photos) > 0:
                            for photo in photos:
                                temp = {
                                    'id': photo.id,
                                    'uri': base_url+str(photo.photo).replace(' ', '%20'),
                                    'date': datetime.datetime.strptime(str(photo.date), f).strftime('%d %b, %y')
                                }
                                responseData.append(temp)

        data['message'] = responseData
        data['result'] = True

    except Exception as e:
        data['message'] = str(e)
        data['result'] = False

    return JsonResponse(data)


def randomPhotos(request):
    try:
        photos = TaskPhotos.objects.all()
        firstRan = random.randint(0, int(len(photos)/2))
        secondRan = random.randint(int(len(photos)/2), len(photos))
        tempPhoto = photos[firstRan:secondRan]
        tempArr = []
        for photo in tempPhoto:
            temp = {
                'id': photo.id,
                'uri': base_url+str(photo.photo).replace(' ', '%20'),
                'date': str(photo.taskUpdate.task.project.name)
            }
            tempArr.append(temp)

        data['message'] = tempArr
        data['result'] = True

    except Exception as e:
        data['message'] = str(e)
        data['result'] = False

    return JsonResponse(data)


class ChatMessageView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            filter = request.GET['filter']
            responseData = []
            if filter == 'chats':
                user = User.objects.get(id=request.GET['user'])

                chatRooms = ChatRoom.objects.filter(user=user)
                for room in chatRooms:
                    lastMessage = ChatMessage.objects.filter(
                        chatRoom=room.project).last()
                    if lastMessage != None:
                        if lastMessage.photo == '':
                            temp = {
                                'id': room.project.id,
                                'project': room.project.name,
                                'date': lastMessage.date.strftime('%H:%M'),
                                'message': str(lastMessage.message),
                            }
                        else:
                            temp = {
                                'id': room.project.id,
                                'project': room.project.name,
                                'date': lastMessage.date.strftime('%H:%M'),
                                'message': 'Photo',
                            }
                    else:
                        temp = {
                            'id': room.project.id,
                            'project': room.project.name,
                            'date': 'Start One',
                            'message': 'Start One'
                        }
                    responseData.append(temp)

            elif filter == 'all':
                chatRooms = ChatRoom.objects.values_list(
                    'project', flat=True).distinct()
                for room in chatRooms:
                    chatRoom = ChatRoom.objects.filter(project_id=room).last()
                    lastMessage = ChatMessage.objects.filter(
                        chatRoom_id=room).last()
                    if lastMessage != None:
                        if lastMessage.photo != '':
                            temp = {
                                'id': chatRoom.project.id,
                                'project': chatRoom.project.name,
                                'date': lastMessage.date.strftime('%H:%M'),
                                'message': 'Photo',
                            }
                        else:
                            temp = {
                                'id': chatRoom.project.id,
                                'project': chatRoom.project.name,
                                'date': lastMessage.date.strftime('%H:%M'),
                                'message': lastMessage.message,
                            }
                    else:
                        temp = {
                            'id': chatRoom.project.id,
                            'project': chatRoom.project.name,
                            'date': 'Start One',
                            'message': 'Start One'
                        }
                    responseData.append(temp)

            elif filter == 'message':
                chatRoom = Project.objects.get(id=request.GET['chatRoom'])
                messages = ChatMessage.objects.filter(chatRoom=chatRoom)
                if len(messages) > 0:
                    for message in messages:
                        if str(message.photo) != '':
                            tempData = {
                                'id': message.id,
                                'user': message.sender.name,
                                'message': message.message,
                                'photo': base_url + str(message.photo),
                                'date': message.date.strftime('%Y-%m-%dT%H:%M:%S'),
                                'user_id': message.sender.id,
                            }
                        else:
                            tempData = {
                                'id': message.id,
                                'user': message.sender.name,
                                'message': message.message,
                                'date': message.date.strftime('%Y-%m-%dT%H:%M:%S'),
                                'photo': '',
                                'user_id': message.sender.id,
                            }
                        responseData.append(tempData)

            data['message'] = responseData
            data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            if not (request.data['photo'] == '' and request.data['message'] == ''):
                messageSerializer = ChatMessageSerializer(data=request.data)
                if messageSerializer.is_valid():
                    chatRoom = Project.objects.get(id=request.data['chatRoom'])
                    sender = User.objects.get(id=request.data['user'])
                    messageSerializer.save(chatRoom=chatRoom, sender=sender)

                    customerNotification = NotificationTable.objects.get(
                        user=chatRoom.customer)
                    if customerNotification != None and sender != chatRoom.customer:
                        customerNotification.status = 1
                        customerNotification.message = 'You got a new Message'
                        customerNotification.save()

                    admins = User.objects.filter(type=0)
                    for admin in admins:
                        if admin != sender:
                            adminNotificaiton = NotificationTable.objects.get(
                                user=admin)
                            adminNotificaiton.status = 1
                            adminNotificaiton.message = 'You got a new Message of project ' + chatRoom.name
                            adminNotificaiton.save()

                    projectManager = ProjectPM.objects.get(
                        project=chatRoom).user
                    if projectManager != None and sender != projectManager:
                        customerNotification = NotificationTable.objects.get(
                            user=projectManager)
                        customerNotification.status = 1
                        customerNotification.message = 'You got a new Message of project ' + chatRoom.name
                        customerNotification.save()

                    siteEngineer = ProjectSE.objects.get(project=chatRoom).user
                    if siteEngineer != None and sender != siteEngineer:
                        customerNotification = NotificationTable.objects.get(
                            user=siteEngineer)
                        customerNotification.status = 1
                        customerNotification.message = 'You got a new Message of project ' + chatRoom.name
                        customerNotification.save()

                    data['message'] = 0
                    data['result'] = True

                else:
                    data['message'] = messageSerializer.errors
                    data['result'] = False
            else:
                data['message'] = "Message and Photo can't be empty"
                data['result'] = False

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)


class ProjectDocumentView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            project = Project.objects.get(id=request.GET['id'])
            documents = ProjectDocuments.objects.filter(project=project)
            docArr = []
            if len(documents) > 0:
                for document in documents:
                    resp = {
                        'id': document.id,
                        'file': document.filename,
                        'url': settings.APP_BASE_URL + str(document.document),
                        'date': document.currDate.strftime('%b %d, %y')
                    }
                    docArr.append(resp)

            data['message'] = docArr
            data['result'] = True

        except Exception as e:
            data['result'] = False
            data['message'] = str(e)

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            serializer = ProjectDocumentSerializer(data=request.data)
            if serializer.is_valid():
                project = Project.objects.get(id=request.data.get('project'))
                serializer.save(project=project)

                data['message'] = 'success'
                data['result'] = True
            else:
                data['message'] = str(serializer.errors)
                data['result'] = False

        except Exception as e:
            data['result'] = False
            data['message'] = str(e)

        return JsonResponse(data)


class AttendaceView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, *args, **kwargs):
        try:
            filter = request.GET['filter']
            if filter == 'labours':
                labours = LabourTable.objects.all()
                tempData = []
                for labour in labours:
                    temp = {
                        'label': labour.fullname,
                        'value': labour.fullname,
                    }
                    tempData.append(temp)

                data['message'] = tempData
                data['result'] = True

            if filter == 'mark':
                project = Project.objects.get(id=request.GET['project'])
                lastDate = AttendaceTable.objects.filter(
                    project=project).last()
                if lastDate != None:
                    todayDate = datetime.datetime.today().date()
                    todayAttendace = AttendaceTable.objects.filter(
                        onDate=todayDate, project=project)
                    attendace = []
                    for present in todayAttendace:
                        temp = {
                            'id': present.id,
                            'hour': present.hours,
                            'name': present.name.fullname,
                        }
                        attendace.append(temp)

                    finalData = {
                        'date': lastDate.onDate.strftime('%m/%d/%y'),
                        'present': attendace
                    }
                    data['message'] = finalData
                    data['result'] = True
                else:
                    data['message'] = 'No'
                    data['result'] = True

            if filter == 'date':
                date = request.GET['date']
                project = Project.objects.get(id=request.GET['project'])
                attendace = AttendaceTable.objects.filter(project=project, onDate=date)
                if attendace != None:
                    if len(attendace) > 0:
                        pre = []
                        for present in attendace:
                            temp = {
                                'id': present.id,
                                'hour': present.hours,
                                'name': present.name.fullname,
                            }
                            pre.append(temp)
                        
                        finalData = {                        
                            'present': pre
                        }
                        data['message'] = finalData
                        data['result'] = True
                    
                    else:
                        data['message'] = '0'
                        data['result'] = True    

                else:
                    data['message'] = '0'
                    data['result'] = True


        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        try:
            filter = request.data['filter']
            if filter == 'addlabour':
                addSerializer = LabourTableSerializer(data=request.data)
                if addSerializer.is_valid():
                    addSerializer.save()
                    data['message'] = str(addSerializer.error_messages)
                    data['result'] = True
                else:
                    data['message'] = str(addSerializer.error_messages)
                    data['result'] = False

            if filter == 'mark':
                labourCount = request.data['labourcount']
                project = Project.objects.get(id=request.data['project'])
                for i in range(int(labourCount)):
                    labour = LabourTable.objects.get(
                        fullname=request.data['person_'+str(i)])
                    hours = request.data['hours_'+str(i)]
                    onDate = request.data['onDate']
                    AttendaceTable(name=labour, project=project,
                                   hours=hours, onDate=onDate).save()
                data['message'] = 'Saved'
                data['result'] = True

            if filter == 'updateAttendance':
                AttendaceTable.objects.filter(onDate=request.data['onDate']).delete()
                labourCount = request.data['labourcount']
                project = Project.objects.get(id=request.data['project'])
                for i in range(int(labourCount)):
                    labour = LabourTable.objects.get(
                        fullname=request.data['person_'+str(i)])
                    hours = request.data['hours_'+str(i)]
                    onDate = request.data['onDate']
                    AttendaceTable(name=labour, project=project,
                                   hours=hours, onDate=onDate).save()
                data['message'] = 'Saved'
                data['result'] = True

        except Exception as e:
            data['message'] = str(e)
            data['result'] = False

        return JsonResponse(data)

def export_csv(request):
    filter = request.GET['filter']
    project = Project.objects.get(id=request.GET['project'])
    if filter == 'user':
        user = request.GET['user']
        labour = LabourTable.objects.get(fullname=user)
        data = download_csv(request, AttendaceTable.objects.filter(name=labour, project=project))
    
    if filter == 'date':
        date = request.GET['date']
        data = download_csv(request, AttendaceTable.objects.filter(onDate=date, project=project))
    
    response = HttpResponse(data, content_type='text/csv')
    return response