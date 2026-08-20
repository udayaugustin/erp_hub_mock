# Static HTML mockups served by nginx.
# No build step — these are plain HTML/CSS/JS files.
FROM nginx:alpine

# Serve the client mock sites from nginx's web root.
# Accessible at:  /wj-mock/  ·  /alnasr-mock/  ·  /ndc-mock/  ·  /zubair-mock/  ·  /vodafone-mock/
COPY wj-mock/       /usr/share/nginx/html/wj-mock/
COPY alnasr-mock/   /usr/share/nginx/html/alnasr-mock/
COPY ndc-mock/      /usr/share/nginx/html/ndc-mock/
COPY zubair-mock/   /usr/share/nginx/html/zubair-mock/
COPY vodafone-mock/ /usr/share/nginx/html/vodafone-mock/

EXPOSE 80