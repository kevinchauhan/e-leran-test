import Header from "./Header";

const Dashboard = () => {
  return (
    <>
      <Header />

      <div className="bg-slate-300 bg-gray-100">
        {/* Container for the courses */}
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <a href="skylearn/addnewstudent">
            <div className="bg-blue-500 text-white rounded-lg p-6 text-center">
              <h1 className="text-3xl font-semibold">Study</h1>
            </div>
          </a>
          {/* Course Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {/* Degree I Year */}
            <div className="bg-blue-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">Degree I Year</h2>
            </div>
            {/* Diploma I Year */}
            <div className="bg-green-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">Diploma I Year</h2>
            </div>
            {/* Degree (II, III & IV Year) */}
            <div className="bg-purple-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">
                Degree (II, III &amp; IV Year)
              </h2>
            </div>
            {/* Diploma (II & III Year) */}
            <div className="bg-orange-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">
                Diploma (II &amp; III Year)
              </h2>
            </div>
            {/* Board / GUJCET */}
            <div className="bg-teal-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">Board / GUJCET</h2>
            </div>
            {/* JEE / NEET */}
            <div className="bg-red-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">JEE / NEET</h2>
            </div>
            {/* Competitive Exam Video Courses */}
            <div className="bg-gray-500 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">
                Competitive Exam Video Courses
              </h2>
            </div>
            {/* Competitive Exam MCQ Courses */}
            <div className="bg-blue-900 text-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold">
                Competitive Exam MCQ Courses
              </h2>
            </div>
            {/* Study Material & Circular */}
            <a href="https://darshan.ac.in/gtu-study-material" target="blank">
              <div className="bg-green-700 text-white p-6 rounded-lg text-center">
                <h2 className="text-lg font-semibold">
                  Study Material &amp; Circular
                </h2>
              </div>
            </a>
            {/* YouTube */}
            <a href="https://www.youtube.com/" target="blank">
              <div className="bg-red-600 text-white p-9 rounded-lg text-center">
                <h2 className="text-lg font-semibold">YouTube</h2>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
