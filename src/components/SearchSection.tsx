import { motion } from "framer-motion";
import FlightSearchBox from "./FlightSearchBox";

const SearchSection = () => (
  <section className="relative -mt-8 z-20 pb-16">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <FlightSearchBox />
      </motion.div>
    </div>
  </section>
);

export default SearchSection;
