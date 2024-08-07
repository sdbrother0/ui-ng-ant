# Getting Started

## About UI (Based on components):

### Tables inline edit with column data types: 
![inline-edit.png](img%2Finline-edit.png)

### Lookup component:
![lookup.png](img%2Flookup.png)

### Table form edit and Master details:
![master-details.png](img%2Fmaster-details.png)

### Reports:
![rep.png](img%2Frep.png)

## UI for https://github.com/sdbrother0/srv 

### Clone and build:

```
git clone https://github.com/sdbrother0/ui-ng-ant.git
cd ui-ng-ant
npm i
```

### Change API_URL:

change API_URL in file: https://github.com/sdbrother0/ui-ng-ant/blob/main/src/environments/environment.ts#L2 to your
(e.g.: `http://localhost:8090` -> `http://192.168.1.20:8090`)
```
export const environment = {
  apiUrl: 'http://192.168.1.20:8090'
};
```
### Run:
```
ng serve
```
