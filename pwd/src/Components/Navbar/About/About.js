import React from 'react'
import './About.css'
import about_img from './about.jpg'


const About = () => {
  return (
    <div className='About'>
        <div className="about-left">
            <img src={about_img} alt="" className='about-img' />
        </div>
        <div className="about-right">
        <h1>About Ability Allies</h1>
            <h2>Your Ally in Every Ability Journey</h2>
            <p>Caregivers often find themselves overwhelmed by the lack of clear, 
                concise information on where to begin when caring for someone with an intellectual disability.
                 Our app addresses this issue by providing a centralized hub for essential resources,
                  expert guidance, and support. By bringing everything together in one place,
                   caregivers will have easy access to what they need,
                 significantly reducing the initial confusion and stress they face.
            </p>
                 <p>This app is designed to provide comprehensive support for individuals with intellectual disabilities, 
                    beginning with Down Syndrome. We recognize the challenge caregivers face when confronted with such conditions: they often do not know where to start. Our app solves this problem by offering all the necessary information, tools, and resources in one place,
                     guiding caregivers through the process of providing the best care.
                    Importantly, the app is not only for children with disabilities but for individuals of all ages,
                    making it a lifelong resource for caregivers. Initially,
                    we are starting with Down Syndrome due to time limitations,
                    but our vision is to expand to support all intellectual disabilities
                </p>
        </div>

        
      
    </div>
  )
}

export default About
