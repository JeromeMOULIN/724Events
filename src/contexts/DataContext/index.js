import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  // const [ last, setLast ] = useState(null);
  const [data, setData] = useState();
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  });

  useEffect(() => {
    if (data) return;
    getData();
  }, []);

  // Search last project 
    let id;
    let latestDate = data?.events[0].date 
  data?.events.forEach((element) => {
    if (element.date > latestDate){
      latestDate = element.date
      id = element.id
    }


  })
  const last = data?.events[id-1]


  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        last,
        data,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
