export default function TableRow({ item, setEditingItem }) {
    return (
      <tr>
        <td>{item.name}</td>
        <td>{item.city}</td>
        <td>{item.country}</td>
        <td>{item.province}</td>
        <td>
          <button className="edit-btn" onClick={() => setEditingItem(item)}>Edit</button>
        </td>
      </tr>
    );
  }
  