# Generated by Django 3.2.9 on 2022-03-08 04:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('userapi', '0005_auto_20220308_0321'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('progress', models.CharField(max_length=4)),
                ('location', models.TextField()),
                ('startDate', models.DateField()),
                ('endDate', models.DateField()),
                ('contractM', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, to='userapi.contractorprofile')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='userapi.customerprofile')),
                ('inventory', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, to='userapi.inventoryprofile')),
                ('projectM', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, to='userapi.projectmanagerprofile')),
                ('siteM', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.PROTECT, to='userapi.siteengineerprofile')),
            ],
        ),
    ]
