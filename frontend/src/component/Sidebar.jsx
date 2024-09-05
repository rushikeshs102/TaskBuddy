// import React from "react";
// import axios from "axios";
// import { CgNotes } from "react-icons/cg";
// import { MdLabelImportant } from "react-icons/md";
// import { FaCheckDouble } from "react-icons/fa";
// import { TbNotebookOff } from "react-icons/tb";
// import { Link } from "react-router-dom";

// function Sidebar({user}) {
//   const data = [
//     {
//       title: "All task",
//       icon: <CgNotes />,
//       link: "/",
//     },
//     {
//       title: "Important task",
//       icon: <MdLabelImportant />,
//       link: "/imptask",
//     },
//     {
//       title: "Completed task",
//       icon: <FaCheckDouble />,
//       link: "/completetask",
//     },
//     {
//       title: "Incomplete task",
//       icon: <TbNotebookOff />,
//       link: "/incompletetask",
//     },
//   ];

//   const handleDelete = () => {
//     axios.get("http://localhost:8081/logout", { withCredentials: true })
//     .then(( ) => {
//       location.reload(true);
//     })
//     .catch((err) => {
//       return console.log(err);});
//     }
//   return (
//     <>
//      <div className="mb-4">
//         <h2 className="text-2xl md:text-3xl">{user.name}</h2>
//         <h4 className="my-2 md:my-3 text-lg md:text-xl text-gray-600">{user.email}</h4>
//         <hr />
//       </div>
//       <div className="text-base md:text-lg">
//         {data.map((item, i) => (
//           <Link
//             to={item.link}
//             key={i}
//             className="my-3 md:my-5 flex gap-4 items-center hover:bg-gray-400 p-2 rounded transition-all duration-300"
//           >
//             {item.icon}
//             {item.title}
//           </Link>
//         ))}
//       </div>
//       <div>
//         <button onClick={handleDelete} className="bg-gray-500 w-full p-2 rounded-lg text-gray-200">
//           Log Out
//         </button>
//       </div>
//     </>
//   );
// }

// export default Sidebar;
// sidebar page code:
import React from "react";
import axios from "axios";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa";
import { TbNotebookOff } from "react-icons/tb";
import { Link } from "react-router-dom";

function Sidebar({ user }) {
  const data = [
    {
      title: "All task",
      icon: <CgNotes />,
      link: "/",
    },
    {
      title: "Important task",
      icon: <MdLabelImportant />,
      link: "/imptask",
    },
    {
      title: "Completed task",
      icon: <FaCheckDouble />,
      link: "/completetask",
    },
    {
      title: "Incomplete task",
      icon: <TbNotebookOff />,
      link: "/incompletetask",
    },
  ];

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout", { withCredentials: true })
      .then(() => {
        location.reload(true);
      })
      .catch((err) => {
        return console.log(err);
      });
  };
  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl">{user.name}</h2>
        <h4 className="my-2 md:my-3 text-lg md:text-xl text-gray-600">
          {user.email}
        </h4>
        <hr />
      </div>
      <div className="text-base md:text-lg">
        {data.map((item, i) => (
          <Link
            to={item.link}
            key={i}
            className={`my-3 md:my-5 flex gap-4 items-center p-2 rounded transition-all duration-300 ${
              location.pathname === item.link ? "bg-gray-500 text-white" : "hover:bg-gray-400"
            }`}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-gray-500 w-full p-2 rounded-lg text-gray-200"
        >
          Log Out
        </button>
      </div>
    </>
  );
}

export default Sidebar;
