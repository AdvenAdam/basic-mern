import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";
import { selectUserById } from "../notes/notesApiSlice";
import { useNavigate } from "react-router-dom";

const User = ({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId))

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${user}`)
        const userRolesString = user.roles.toString().replaceAll(',', ', ')
        const cellStatus = user.active ? '' : 'tavble__cell--inactive'

        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table_cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table_cell ${cellStatus}`}>
                    <button className="icon-button table__button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null

}

export default User

