function FirebaseSetupBanner() {
  return (
    <div className="bg-red-500 p-4 rounded-lg shadow-md">
      <h1>Firebase Setup Banner</h1>
      <p>Please setup your Firebase project to continue</p>
      <button>Setup Firebase</button>
      <button>Close</button>
      <button>Learn more</button>
    </div>
  );
}

export { FirebaseSetupBanner };
