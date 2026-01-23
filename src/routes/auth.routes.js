import express from 'express';

const authRoutes = express.Router();

authRoutes.post('/login',(req,res)=>{
  res.status(200).send('Login route');
});
authRoutes.post('/register',(req,res)=>{
  res.status(200).send('Register route');
});

export default authRoutes;