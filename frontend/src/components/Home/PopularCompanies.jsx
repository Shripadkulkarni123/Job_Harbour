import React from 'react';

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      name: "Tech Solutions",
      location: "New York, USA",
    },
    {
      id: 2,
      name: "Digital Innovations",
      location: "San Francisco, USA",
    },
    {
      id: 3,
      name: "Global Systems",
      location: "London, UK",
    }
  ];

  return (
    <section className="companies">
      <div className="container">
        <div className="section-header">
          <h2>Top Companies</h2>
        </div>
        <div className="banner">
          {companies.map((company) => (
            <div className="card" key={company.id}>
              <div className="text">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#2557a7', marginBottom: '0.5rem' }}>{company.name}</h3>
                <div style={{ fontSize: '0.95rem', color: '#666' }}>{company.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies; 