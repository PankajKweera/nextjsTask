export default function EditItemForm({ editingItem, setEditingItem }) {
    return (
      <div className="form-container">
        <input type="text" name="name" value={editingItem.name} className="form-input"
          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
        <button className="save-btn">Save</button>
      </div>
    );
  }
  