import './App.css';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

function App() {
  const [theme,setTheme]= useState("light");
  const [response,setResponse]= useState();
  const initialValues = {
    season:"summer",
    age:18,
    disease:"0",
    accident:"0",
    surgery:"0",
    fever:"-1",
    smoking:"-1"
  }
  const validationSchema = Yup.object().shape({
    season: Yup.string().required("Choose a season"),
    age: Yup.number().required("Enter age").min(0),
    disease: Yup.string().required("Choose a option"),
    accident: Yup.string().required("Choose a option"),
    surgery: Yup.string().required("Choose a option"),
    fever: Yup.string().required("Choose a option"),
    smoking: Yup.string().required("Choose a option"),

  });
  const themeChange=()=>{
    if(theme==="light"){
      setTheme("dark")
    }else{
      setTheme("light")
    }
  }
  const onSubmit=(data)=>{
    console.log(data);
    axios.post("http://localhost:8000/data",{
    headers: {
        'Content-Type': 'application/json'
    },
    body: data
    }).then(res=>{
      setResponse(res.data.message)
    })
  }
  return (
    <div className={`App ${theme}`}>
      <h1 className="text-4xl p-4" >Online Fertility Diagnostic Tool</h1>
      <button onClick={themeChange}>Toggle {theme} mode</button>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form>
          <div className='mt-4 flex justify-around'>
            <div className=''>
              <h1 className='text-xl'>Season in which the analysis was performed: </h1>
              <label className='p-2'>
                <Field type="radio" name="season" value="summer" />
                Summer
              </label>
              <label className='p-2'>
                <Field type="radio" name="season" value="winter" />
                Winter
               </label>
              <label className='p-2'>
                <Field type="radio" name="season" value="autumn" />
                Autumn
              </label>
              <label className='p-2'>
                <Field type="radio" name="season" value="spring" />
                Spring
               </label>
            </div>
          </div>

          <div className='mt-4'>
            <label className='text-xl'>Age at the time of analysis : </label>
            <ErrorMessage className='text-xs text-white' name='age' component="span"></ErrorMessage>
            <Field className={`${theme}`} name="age" placeholder="enter age" type="number" />
          </div>
          <div className='mt-4'>
            <label className='text-xl'>Childish diseases (ie , chicken pox, measles, mumps, polio): </label>
            <Field className={`${theme}`} name="disease" as="select">
              <option value="0">yes</option>
              <option value="1">no</option>
            </Field>
          </div>
          
          <div className='mt-4 flex justify-around'>
            <div>
              <h1 className='text-xl mt-2'>High fevers in the last year : </h1>
              <label className='p-2'>
                <Field type="radio" name="fever" value="-1" />
                less than three months ago
              </label>
              <label className='p-2'>
                <Field type="radio" name="fever" value="0" />
                less than three months ago
               </label>
              <label className='p-2'>
                <Field type="radio" name="fever" value="1" />
                no
              </label>
            </div>
          </div>

          <div className='mt-2'>
            <div>
              <label className='text-xl'>Accident or serious trauma : </label>
              <Field className={`${theme}`} name="accident" as="select">
                <option value="0">yes</option>
                <option value="1">no</option>
              </Field>
            </div>
            <div>
              <label className='text-xl'>Surgical intervention : </label>
              <Field className={`${theme}`} name="surgery" as="select">
                <option value="0">yes</option>
                <option value="1">no</option>
              </Field>
            </div>
          </div>

          <div className='mt-4 flex justify-around'>
            <div>
              <h1 className='text-xl'>Smoking habit : </h1>
              <label className='p-2'>
                <Field type="radio" name="smoking" value="-1" />
                never
              </label>
              <label className='p-2'>
                <Field type="radio" name="smoking" value="0" />
                occasional
               </label>
              <label className='p-2'>
                <Field type="radio" name="smoking" value="1" />
                daily
              </label>
            </div>
          </div>
          
          <button onClick={onSubmit} className="bg-green-500 mt-6 hover:bg-blue-700 shadow-xl text-white uppercase text-sm font-semibold px-14 py-3 rounded">Diagnose</button>
        </Form>
      </Formik>
      <div className='mt-8 pb-40'>
        <h1>Results:</h1>
        {
          response == 1 && 
          <p className='text-green-500'>Your sperms are normal</p>
        }
        {
          response == 0 && 
          <p className='text-red-500'>Your sperms are altered</p>
        }
      </div>
    </div>
  );
}

export default App;
