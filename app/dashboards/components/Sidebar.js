import React from "react";
import Link from "next/link";
import { Home, Sparkles, FolderOpen, Code, FileText, ExternalLink, User } from "lucide-react";

const Sidebar = ({ user }) => {
  const navItems = [
    { icon: Home, label: "Overview", href: "#", isActive: true },
    { icon: Sparkles, label: "Research Assistant", href: "#" },
    { icon: FolderOpen, label: "Research Reports", href: "#" },
    { icon: Code, label: "API Playground", href: "/playground" },
    { icon: FileText, label: "Invoices", href: "#" },
    { icon: FileText, label: "Documentation", href: "#", hasExternalLink: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col py-8 px-6 min-h-screen">
      <div className="text-2xl font-bold mb-10 tracking-tight text-gray-900">Data 360</div>
      
      <nav className="flex flex-col gap-1 text-base">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExternal = item.hasExternalLink;
          
          if (isExternal) {
            return (
              <a
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  item.isActive
                    ? "text-gray-900 bg-blue-50 border border-blue-100"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
                href={item.href}
                aria-label={item.label}
                tabIndex={0}
              >
                <Icon className={`w-5 h-5 ${item.isActive ? "text-gray-700" : "text-gray-600"}`} />
                {item.label}
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </a>
            );
          }
          
          return (
            <Link
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                item.isActive
                  ? "text-gray-900 bg-blue-50 border border-blue-100"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
              href={item.href}
              aria-label={item.label}
              tabIndex={0}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? "text-gray-700" : "text-gray-600"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto flex items-center gap-3 pt-10 px-3 py-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
          <User className="w-4 h-4" />
        </div>
        <span className="text-gray-700 text-sm font-medium">
          {user?.name ? user.name : "Developer Mode"}
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
