export const cookies={
  getOptions:()=>({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15*60*1000, // 15 minutes
  })
};