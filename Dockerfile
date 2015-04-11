FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm
# Install apache
RUN     yum install -y httpd
# Install grunt
RUN     npm install -g grunt

# Bundle app source
COPY . /var/www/html

# Install app dependencies
RUN cd /var/www/html; npm install

EXPOSE  80

ENTRYPOINT [ "/usr/sbin/httpd" ]
CMD [ "-D", "FOREGROUND" ]

