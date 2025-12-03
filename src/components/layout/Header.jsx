import React from "react";
import { useAppContext } from "../../context/AppContext";
import PerspectiveSwitcher from "./PerspectiveSwitcher";
import logo from "../../assets/logo.svg";

function Header() {
  const { user } = useAppContext();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="3Minutes"
            className="h-7 w-7 flex-shrink-0"
          />
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-50">
              3Minutes
            </div>
            <div className="text-[11px] text-emerald-400">
              Mortgage Intelligence in 3 Minutes.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden text-right text-[11px] text-slate-400 sm:block">
              <div className="font-medium text-slate-200">
                {user.name || "Guest"}
              </div>
              {user.phone && <div>WhatsApp: {user.phone}</div>}
            </div>
          )}
          <PerspectiveSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
