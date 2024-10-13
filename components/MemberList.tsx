import { useStore } from "../store/store";

  
  const MemberList: React.FC = () => {
    const members = useStore(state => state.members)
    return (
      <div>
        <h3>Members ({members.length}):</h3>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default MemberList;
  