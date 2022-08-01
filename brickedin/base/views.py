from django.shortcuts import render, redirect
from django.core.mail import send_mail
from base.models import QueryTable
from django.contrib import messages
from brickedin import settings  # import messages
from django.views.decorators.csrf import csrf_exempt

customer_response = """
Welcome to BrickedIN

Thank you for reaching us!

Soon you will get a call from our executive.

BrickedIN Team
Building Dreams
"""

subject = "BrickedIN Welcome"

# Create your views here.


def home(request):
    return render(request, "base/index.html", {'page': 'home'})


def about(request):
    return render(request, "base/about.html", {'page': 'about'})


def contact(request):
    return render(request, "base/contact.html", {'page': 'contact'})


def portfolio(request):
    return render(request, "base/portfolio.html", {'page': 'portfolio'})


def services(request):
    return render(request, "base/services.html", {'page': 'services'})


def queryForm(request):
    global customer_response
    if request.method == "POST":
        name = request.POST['name']
        email = request.POST['email']
        mobile = request.POST['phone']

        if 'services' in request.POST:
            services = request.POST['services']
        else:
            services = ""

        if 'message' in request.POST:
            message = request.POST['message']
        else:
            message = ""

        print("Sending Email")
        customer_response += name + " " + email + " " + mobile
        send_mail(subject, customer_response,
                  settings.EMAIL_HOST_USER, ["sarthaksnh5@gmail.com"])

        print("Email sent")

        QueryTable(name=name, email=email, mobile=mobile,
                   services=services, message=message).save()

        messages.success(
            request, 'Thank you for contacting us. Our Executive will contact you soon')
        return redirect('home')
