---
title: Docker basics/ cheatsheet
published: true
description: 
tags: docker,containers,unix
cover_image: https://3kllhk1ibq34qk6sp3bhtox1-wpengine.netdna-ssl.com/wp-content/uploads/2017/01/how-to-deploy-java-apps-with-docker-a-quick-tutorial@3x-1560x760.png
---

### Create image using this directory's Dockerfile
docker build -t <somename> 

### Run <somename> mapping port 8000

- docker run -p 8000:80 <somename>   

### Same thing, but in detached mode
- docker run -d -p 8000:80 <somename>          

### Enter a running container (you can also do sh)
- docker exec -it [container-id] bash  
          
### See a list of all running containers      
- docker ps       

### Gracefully stop the specified container                     
- docker stop <hash>    

### See a list of all containers , active and inactive 
- docker ps -a 
          
### Force shutdown of the specified container
- docker kill <hash>   

### Remove the specified container from this machine   
- docker rm <hash>      
   
### Remove all containers from this machine
- docker rm $(docker ps -a -q) 
    
### Show all images on this machine
- docker images -a   
 
### Remove the specified image from this machine     
- docker rmi <imagename>   
  
### Remove all images from this machine   
docker rmi $(docker images -q)    

### Log in this CLI session using your Docker credentials
- docker login    
       
### Tag <image> for upload to registry
- docker tag <image> username/repository:tag 

### Upload tagged image to registry
- docker push username/repository:tag   

### Run image from a registry
        
- docker run username/repository:tag                