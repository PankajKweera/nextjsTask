export default function AddItemForm({ newItem, setNewItem }) {
    return (
      <div className="form-container">
        <input type="text" name="name" placeholder="Name" className="form-input"
          value={newItem.name || ""} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <button className="add-btn">Add</button>
      </div>
    );
  }
  