import React from "react";

import UserList from "./component/list"
const Users = () => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-12 px-4">
               {/* {'import component list vào '} */}
               <UserList></UserList>
            </div>                  
        </div>
    )
}

export default Users;