// import React, { useState } from 'react';

// const LoginForm = ({ onSubmit }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   return (
//     <form
//       onSubmit={(e) => onSubmit(e, { email, password })}
//       className="p-5 border rounded shadow"
//       style={{
//         maxWidth: '500px',
//         width: '100%',
//         fontSize: '1.05rem',
//         backgroundColor: '#f5efefff',
//       }}
//     >
//       <h3 className="mb-4 text-center text-danger">Login</h3>

//       <div className="mb-3">
//         <label className="form-label text-dark">Email</label>
//         <input
//           type="email"
//           className="form-control form-control-lg bg-light border-danger"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label text-dark">Password</label>
//         <input
//           type="password"
//           className="form-control form-control-lg bg-light border-danger"
//           required
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <button
//         type="submit"
//         className="btn w-100 btn-lg text-white"
//         style={{ backgroundColor: '#bd0221ff', border: 'none' }}
//       >
//         Login
//       </button>
//     </form>
//   );
// };

// export default LoginForm;