export default function TableHead() {
    return (
      <thead>
        <tr>
          {["Name", "City", "Country", "Province", "Actions"].map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
    );
  }
  