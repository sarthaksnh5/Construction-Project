# Generated by Django 3.2.9 on 2022-03-10 07:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projectsapi', '0011_projectpayment'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectMaterial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=200, unique=True)),
                ('dimensions', models.CharField(max_length=60)),
                ('description', models.CharField(blank=True, max_length=200)),
                ('date', models.DateField(auto_now=True)),
                ('tag', models.CharField(choices=[(0, 'Electrical'), (1, 'Modelling'), (2, 'Building')], max_length=200)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='projectsapi.project')),
            ],
        ),
    ]
