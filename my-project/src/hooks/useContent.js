import { useState, useEffect, useCallback } from "react";
import {
  getAllModules,
  getAllTimetables,
  CONTENT_UPDATED_EVENT,
} from "../utils/contentStorage";

export function useContent() {
  const [modules, setModules] = useState(getAllModules);
  const [timetables, setTimetables] = useState(getAllTimetables);

  const refresh = useCallback(() => {
    setModules(getAllModules());
    setTimetables(getAllTimetables());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(CONTENT_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CONTENT_UPDATED_EVENT, refresh);
  }, [refresh]);

  return { modules, timetables, refresh };
}
