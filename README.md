# MERN LAVENDERSHOP

# PRODUCED BY LOO KAH YEW AND LEE VOON KANG

# TARUMT FYP 2022

# To run locally

# 1. Clone repository

    $ git clone https://github.com/lavender0104/lavendershop.git

# 2. Rename .env file

    Rename .env.example in backend folder to .env

# 3. Run backend server

    $ cd backend
    $ npm install
    $ npm start

# 4. Run frontend

    $ go to new terminal
    $ cd frontend
    $ npm run dev
    $ on browser, go to localhost:5173

# 5. For the first run, seed users and products

    $ on browser, go to localhost:5000/api/seed
    $ default users and products will be created

# 6. Login as admin

    $ on browser, go to signin page
    $ enter admin@gmail.com as email and 123456 as password
    $ as the OTP implementation, to signin, please contact us to assist you as we need to access the email messages to get the OTP code to signin.

# x. Possible switches in .env file to suit to your choice

    i) MONGODB_URI -> To connect to atlas mongodb
    ii) SENDER_EMAIL -> OTP sender email
    iii) SENDER_PASSWORD -> OTP sender password
    iv) CLOUDINARY related environment variables are for uploading picture

# Contact Us if need support

    i) Loo Kah Yew - worklavender0104@gmail.com
    ii) Lee Voon Kang - biobear2000@gmail.com
