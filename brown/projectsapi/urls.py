from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProjectView.as_view(), name='project'),
    path('team', views.TeamDataView.as_view(), name='team'),
    path('payment', views.PaymentDataView.as_view(), name='payment'),
    path('material', views.MaterialDataView.as_view(), name='material'),
    path('materialquantity', views.MaterialQuantityView.as_view(), name='materialquantity'),
    path('alltask', views.TaskDataView.as_view(), name='alltask'),
    path('task', views.TaskUpdateView.as_view(), name='task'),
    path('photo', views.photoData, name='photo'),
    path('randPhoto', views.randomPhotos, name='randPhoto'),
    path('message', views.ChatMessageView.as_view(), name='message'),
    path('document', views.ProjectDocumentView.as_view(), name='document'),
    path('attendance', views.AttendaceView.as_view(), name='attendance'),
    path('labour.csv', views.export_csv, name="downcsv"),
]
