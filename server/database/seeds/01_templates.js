const templates = [
  {
    name: "Modern Landing Page",
    description:
      "A clean and modern landing page template for startups and businesses. Fully responsive and easy to customize.",
    thumbnail_url: "/thumbnails/landing-page.svg",
    category: "Landing Pages",
    features: [
      "Responsive design",
      "Modern UI/UX",
      "Easy to customize",
      "Built with modern technologies",
    ],
  },
  {
    name: "SaaS Dashboard",
    description: "Fully responsive dashboard template with analytics.",
    thumbnail_url: "/thumbnails/dashboard.svg",
    category: "Dashboards",
    features: [
      "Responsive layout",
      "Analytics charts",
      "Data tables",
      "Sidebar navigation",
    ],
  },
  {
    name: "E-Commerce Store",
    description: "Modern e-commerce template with product showcase.",
    thumbnail_url: "/thumbnails/ecommerce.svg",
    category: "E-commerce",
    features: [
      "Product showcase grid",
      "Hero banner",
      "Responsive design",
      "Easy to customize",
    ],
  },
  {
    name: "Portfolio Template",
    description: "Minimal portfolio template for creatives.",
    thumbnail_url: "/thumbnails/portfolio.svg",
    category: "Portfolios",
    features: [
      "Project gallery",
      "Minimal dark theme",
      "Responsive design",
      "Easy to customize",
    ],
  },
  {
    name: "Blog Template",
    description: "Clean blog template with modern design.",
    thumbnail_url: "/thumbnails/blog.svg",
    category: "Blogs",
    features: [
      "Featured post header",
      "Article card layout",
      "Responsive design",
      "Easy to customize",
    ],
  },
  {
    name: "Agency Website",
    description: "Professional agency website template.",
    thumbnail_url: "/thumbnails/agency.svg",
    category: "Websites",
    features: [
      "Hero section",
      "Services layout",
      "Responsive design",
      "Easy to customize",
    ],
  },
];

exports.seed = async function (knex) {
  const { count } = await knex("templates").count({ count: "*" }).first();
  if (count > 0) {
    return;
  }

  const rows = templates.map((template) => ({
    ...template,
    features: JSON.stringify(template.features),
  }));
  await knex("templates").insert(rows);
};
