# Experiment UI (Angular + Ant)

### Video example:
https://www.youtube.com/watch?v=qHkae5jq7e0

### Visit for example https://sdbrother.org/

### UI for https://github.com/sdbrother0/srv

#### Used https://ng.ant.design

## Key Features:

### 1. Tables inline edit based on column data types 
![inline-edit.png](img%2Finline-edit.png)

### 2. Lookup component
![lookup.png](img%2Flookup.png)

### 3. Table edit by form and support Master-Details and validation rules from backend
![master-details.png](img%2Fmaster-details.png)

### 4. Reports
![rep.png](img%2Frep.png)

## 5. Backend MetaData example for object "Invoice"

```
{
  "url" : "/invoice",
  "name": "invoice",
  "key": "id",
  "fields": [
      {
          "name": "id",
          "label": "Id",
          "type": {
              "name": "string"
          },
          "hidden": false
      },
      {
          "name": "created",
          "label": "Date time",
          "type": {
              "name": "date",
              "format": "yyyy-MM-dd HH:mm:ss"
          },
          "editable": true,
          "validation": {
              "required": true,
              "message": "Input date please!!!"
          }
      },
      {
          "name": "customer",
          "label": "Customer",
          "type": {
              "name": "lookup",
              "metaUrl": "/meta/customer",
              "foreignKey": "customer_id",
              "keyFieldName": "id",
              "valFieldName": "name"
          },
          "validation": {
              "required": true,
              "message": "Select customer please!!!"
          },
          "editable": true
      },
      {
          "name": "total",
          "label": "Total",
          "type": {
              "name": "number"
          },
          "editable": false
      },
      {
          "name": "taxTotal",
          "label": "Tax total",
          "type": {
              "name": "number"
          },
          "editable": false
      }
  ],
  "details": [
        {
          "label": "Invoice details",
          "metaUrl" : "/meta/invoice_details"
        }
  ],
  "reports": [
      {
          "label": "Invoice pdf",
          "url": "/reports/invoice"
      }
  ]
}
```
https://github.com/sdbrother0/srv/blob/main/src/main/java/srv/service/InvoiceService.java#L80

## Run UI:

### 1. Run server from https://github.com/sdbrother0/srv

### 2. Clone and build:

```
git clone https://github.com/sdbrother0/ui-ng-ant.git
cd ui-ng-ant
npm i
```

### 3. Change API_URL:

change API_URL in file: https://github.com/sdbrother0/ui-ng-ant/blob/main/src/environments/environment.ts#L2 to your
(e.g.: `http://localhost:8090` -> `http://192.168.1.20:8090`)
```
export const environment = {
  apiUrl: 'http://192.168.1.20:8090'
};
```

### 4. Run UI:
```
ng serve
```

### 5. Docker build and run
```
docker build -t sdbrother/ui:v0 .
docker run -d -p 4200:4200 sdbrother/ui:v0
```

### 6. Build prod
```
ng build --c=production ui-ng-ant
```
