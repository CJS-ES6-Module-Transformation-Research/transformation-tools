//test_resources.import java.io.IOException;
//test_resources.import java.nio.file.Files;
//test_resources.import java.nio.file.Path;
//test_resources.import java.nio.file.Paths;
//test_resources.import java.util.LinkedHashMap;
//test_resources.import java.util.Map;
//test_resources.import java.util.stream.Collectors;
//
//public class ExAct {
//    public static void main(String[] args) throws IOException {
//        Path p = Paths.get("../test/sanitize/require_string.tests_list.txt");
//        var list = Files.newBufferedReader(p).lines().collect(Collectors.toList());
//        String str = "../test/sanitize/require_string/must_sanitize/DotDot_handling/";
//
//        Map<Path, String> pathTestMap = new LinkedHashMap<>();
//        list.stream().forEach(_str -> {
//
//            if (_str.trim().length() > 0) {
//                String[] split = _str.split("====");
//                System.out.println(0+split[0]);
//                System.out.println(1+split[1 ]);
//                String path = split[1];
//                String data = split[0];
//                pathTestMap.put(Path.of(str, path+".js"), data);
//
//            }
//
//
//        });
//        pathTestMap.entrySet().forEach(e -> {
//            try {
//                if (Files.exists(e.getKey())){
//                    Files.delete((e.getKey()));
//                }
//                Path x = Files.createFile(e.getKey());
//                System.out.println(e.getKey());
//                var bw = Files.newBufferedWriter(x);
//                bw.write(e.getValue());
//                bw.close();
//            } catch (RuntimeException | IOException ee) {
//                ee.printStackTrace();
//            }
//        });
//    }
//}
