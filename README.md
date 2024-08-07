# Experiment UI (Angular + Ant)

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

## UI for https://github.com/sdbrother0/srv 

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
