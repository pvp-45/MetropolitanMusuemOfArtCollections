FROM mcr.microsoft.com/windows/servercore:ltsc2019

WORKDIR /usr/src/app

RUN powershell -Command `
    Invoke-WebRequest -Uri https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi -OutFile nodejs.msi; `
    Start-Process msiexec -ArgumentList '/i nodejs.msi /quiet' -NoNewWindow -Wait; `
    Remove-Item -Force nodejs.msi

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
