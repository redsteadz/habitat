import "./loading.css";

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
      </div>
    </div>
  );
}
