import csv
from django.http import HttpResponse


def download_csv(request, queryset):

    model = queryset.model
    model_fields = model._meta.fields + model._meta.many_to_many
    field_names = [field.name for field in model_fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="export.csv"'

    # the csv writer
    writer = csv.writer(response, delimiter=",")
    # Write a first row with header information
    writer.writerow(field_names)
    # Write data rows
    for row in queryset:
        values = []
        id = 1
        for field in field_names:            
            if field == 'name':
                value = getattr(row, field).fullname
            elif field == 'hours':
                value = getattr(row, field)
            elif field == 'project':
                value = getattr(row, field).name 
            elif field == 'onDate':
                value = getattr(row, field)
            else:
                value = id
                id = id + 1            
            values.append(value)            
        writer.writerow(values)
    return response
