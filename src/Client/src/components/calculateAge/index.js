import { useState, useEffect } from 'react';

const useAge = () => {
  const [age, setAge] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      const birthday = parsedUser.birthday;

      if (birthday) {
        const calculateAge = (birthday) => {
          const birthDate = new Date(birthday);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const month = today.getMonth();
          if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        };

        setAge(calculateAge(birthday));
      }
    }
  }, []); 

  return age; 
};

export default useAge;