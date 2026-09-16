#include <iostream>
#include <tbb/parallel_for.h>
#include <tbb/blocked_range.h>
#include <tbb/parallel_reduce.h>
#include <vector>
#include <chrono>

using namespace std;
using namespace std::chrono;

const int VECTOR_SIZE = 1000000;

vector<long> v(VECTOR_SIZE);

void fillVector(){
    tbb::parallel_for(
        tbb::blocked_range<int>(0, VECTOR_SIZE),
         [&](tbb::blocked_range<int> r){
        for (int i = r.begin(); i < r.end(); i++) {
            v[i] = 10;
        }
    });
}

void sumVector(long &result) {
    result = tbb::parallel_reduce(
        tbb::blocked_range<int>(0, VECTOR_SIZE),
        0,
        [&](tbb::blocked_range<int> r, long init) -> long {
            for (int i = r.begin(); i < r.end(); i++) {
                init += v[i];
            }
            return init;
        },
        [](long x, long y) -> long {
            return x + y;
        });
}

int main() {
    auto start = high_resolution_clock::now();

    fillVector();

    long result = 0;
    sumVector(result);

    auto stop = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(stop - start);
    cout << "Time TBB: " << duration.count() << " ms" << endl;

    cout << "Result: " << result << endl;

    return 0;
}
